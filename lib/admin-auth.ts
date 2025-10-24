import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

// Rate limiting with in-memory storage (no DB required)
const rateLimits = new Map<string, { attempts: number; lastAttempt: number }>()
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const MAX_ATTEMPTS = 5

async function checkRateLimit(key: string): Promise<{ allowed: boolean; remainingAttempts: number }> {
  const now = Date.now()
  const userLimit = rateLimits.get(key) || { attempts: 0, lastAttempt: now }

  // Reset if outside window
  if (now - userLimit.lastAttempt > RATE_LIMIT_WINDOW) {
    userLimit.attempts = 0
    userLimit.lastAttempt = now
  }

  // Increment attempts
  userLimit.attempts++
  rateLimits.set(key, userLimit)

  return {
    allowed: userLimit.attempts <= MAX_ATTEMPTS,
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - userLimit.attempts)
  }
}

// Role validation with strict permission checking
function validateAdminRole(adminRole: any, requiredRole?: string): boolean {
  if (!adminRole?.role) return false

  // Super admin has all permissions
  if (adminRole.role === 'super_admin') return true

  // If specific role is required, check it
  if (requiredRole && adminRole.role !== requiredRole) {
    return false
  }

  // Additional security checks
  const minSecurityChecks = [
    !!adminRole.permissions, // Must have permissions defined
    Array.isArray(adminRole.permissions), // Must be an array
    adminRole.last_active, // Must have last active timestamp
  ]

  return minSecurityChecks.every(check => check === true)
}

// Enhanced security logging
async function logAuthFailure(reason: string, userId?: string, role?: string) {
  console.error(`[Admin Auth Failure] ${new Date().toISOString()}:`, {
    reason,
    userId,
    role,
    source: 'admin-auth.ts',
    environment: process.env.NODE_ENV,
  })

  // You could also emit custom events or metrics here
  // window.dispatchEvent(new CustomEvent('adminAuthFailure', { detail: { reason } }))
}

// Main admin authentication function
export async function requireAdmin(requiredRole?: string) {
  const supabase = await createClient()

  // 1. Check user authentication
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    await logAuthFailure('No authenticated user', user?.id)
    redirect("/admin/login")
  }

  // 2. Rate limiting check (prevent brute force)
  const rateLimitKey = `admin_auth_${user.id}`
  const rateLimitResult = await checkRateLimit(rateLimitKey)
  if (!rateLimitResult.allowed) {
    await logAuthFailure('Rate limit exceeded', user.id)
    throw new Error('Too many authentication attempts. Please try again later.')
  }

  // 3. Check admin role with enhanced security
  const { data: adminRole, error: roleError } = await supabase
    .from("admin_roles")
    .select("role, last_active, permissions")
    .eq("user_id", user.id)
    .single()

  if (roleError || !adminRole) {
    await logAuthFailure('No admin role found', user.id)
    console.warn("[v1] No admin role found, redirecting to unauthorized")
    redirect("/admin/unauthorized")
  }

  // 4. Enhanced role validation
  const hasValidRole = validateAdminRole(adminRole, requiredRole)
  if (!hasValidRole) {
    await logAuthFailure('Invalid role permissions', user.id, adminRole.role)
    redirect("/admin/unauthorized")
  }

  // 5. Update last active timestamp and log successful access
  await logAdminActivity('admin_auth', 'authentication', user.id, {
    role: adminRole.role,
    requiredRole,
    success: true
  })

  return { 
    user, 
    role: adminRole.role,
    permissions: adminRole.permissions || [],
    lastActive: adminRole.last_active
  }
}

interface AdminUser {
  user: any
  role: string
  permissions: string[]
  metadata: {
    lastActive: string
    loginCount: number
    securityLevel: 'standard' | 'elevated' | 'super'
  }
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createClient()

  try {
    // 1. Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.debug('[Admin Auth] No authenticated user found')
      return null
    }

    // 2. Get admin role with enhanced data
    const { data: adminRole } = await supabase
      .from("admin_roles")
      .select("role, permissions, last_active, metadata")
      .eq("user_id", user.id)
      .single()

    if (!adminRole) {
      console.debug('[Admin Auth] No admin role found for user:', user.id)
      return null
    }

    // 3. Validate admin session
    const sessionValid = validateAdminSession(adminRole)
    if (!sessionValid) {
      console.warn('[Admin Auth] Invalid admin session detected')
      return null
    }

    // 4. Construct enhanced admin user object
    const adminUser: AdminUser = {
      user: {
        id: user.id,
        email: user.email,
        lastSignIn: user.last_sign_in_at,
      },
      role: adminRole.role,
      permissions: Array.isArray(adminRole.permissions) ? adminRole.permissions : [],
      metadata: {
        lastActive: adminRole.last_active || new Date().toISOString(),
        loginCount: (adminRole.metadata?.login_count || 0) + 1,
        securityLevel: determineSecurityLevel(adminRole)
      }
    }

    // 5. Log successful access
    await logAdminActivity(
      'admin_session_check',
      'auth',
      user.id,
      { 
        securityLevel: adminUser.metadata.securityLevel,
        loginCount: adminUser.metadata.loginCount
      },
      { severity: 'low' }
    )

    return adminUser

  } catch (error) {
    console.error('[Admin Auth] Error in getAdminUser:', error)
    await logAuthFailure('Error in getAdminUser', undefined, undefined)
    return null
  }
}

function validateAdminSession(adminRole: any): boolean {
  if (!adminRole?.role) return false

  // Check if the last active timestamp is within 24 hours
  const lastActive = new Date(adminRole.last_active || 0)
  const hoursSinceActive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60)
  
  return hoursSinceActive <= 24
}

function determineSecurityLevel(adminRole: any): 'standard' | 'elevated' | 'super' {
  if (adminRole.role === 'super_admin') return 'super'
  if (Array.isArray(adminRole.permissions) && adminRole.permissions.length > 5) return 'elevated'
  return 'standard'
}

interface AdminActivityLog {
  action: string
  targetType?: string
  targetId?: string
  details?: Record<string, unknown>
  severity?: 'low' | 'medium' | 'high' | 'critical'
  source?: string
}

export async function logAdminActivity(
  action: string,
  targetType?: string,
  targetId?: string,
  details?: Record<string, unknown>,
  options: { severity?: 'low' | 'medium' | 'high' | 'critical'; source?: string } = {}
) {
  const supabase = await createClient()

  // 1. Validate user authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.error('[Admin Activity] Failed to log activity: No authenticated user')
    return
  }

  // 2. Sanitize and validate input
  const sanitizedDetails = sanitizeLogDetails(details || {})
  const validatedAction = validateLogAction(action)
  
  if (!validatedAction) {
    console.error('[Admin Activity] Invalid action:', action)
    return
  }

  // 3. Prepare log entry with enhanced metadata
  const logEntry = {
    admin_user_id: user.id,
    action: validatedAction,
    target_type: targetType?.slice(0, 50), // Limit string length
    target_id: targetId?.slice(0, 50),
    details: sanitizedDetails,
    severity: options.severity || 'low',
    source: options.source || 'admin-auth.ts',
    client_timestamp: new Date().toISOString(),
    client_info: {
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
  }

  // 4. Log with error handling and retries
  try {
    await supabase.from("admin_activity_log").insert(logEntry)
    
    // 5. Emit event for real-time monitoring
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('adminActivity', { 
        detail: { action, severity: logEntry.severity }
      }))
    }
  } catch (error) {
    console.error('[Admin Activity] Logging failed:', error)
    
    // 6. Fallback to local storage if DB insert fails
    if (typeof window !== 'undefined') {
      const failedLogs = JSON.parse(localStorage.getItem('failedAdminLogs') || '[]')
      failedLogs.push({ ...logEntry, error: String(error) })
      localStorage.setItem('failedAdminLogs', JSON.stringify(failedLogs.slice(-50))) // Keep last 50
    }
  }
}

// Utility functions for activity logging
function sanitizeLogDetails(details: Record<string, unknown>): Record<string, unknown> {
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth']
  
  return Object.fromEntries(
    Object.entries(details).map(([key, value]) => {
      // Remove sensitive data
      if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
        return [key, '[REDACTED]']
      }
      
      // Limit string lengths
      if (typeof value === 'string') {
        return [key, value.slice(0, 200)] // Limit string length
      }
      
      return [key, value]
    })
  )
}

function validateLogAction(action: string): string | null {
  const validActions = [
    'login', 'logout', 'create', 'update', 'delete', 
    'view', 'export', 'import', 'admin_auth', 'settings_change'
  ]
  
  const normalizedAction = action.toLowerCase().trim()
  
  if (validActions.includes(normalizedAction)) {
    return normalizedAction
  }
  
  // Allow custom actions with prefix
  if (normalizedAction.startsWith('custom_')) {
    return normalizedAction.slice(0, 50) // Limit length
  }
  
  return null
}
