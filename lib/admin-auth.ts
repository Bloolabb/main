import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function requireAdmin(requiredRole?: string) {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/admin/login")
  }

  const { data: adminRole, error: roleError } = await supabase
    .from("admin_roles")
    .select("role")
    .eq("user_id", user.id)
    .single()

  console.log("[v0] Admin role check for user:", user.id, "Result:", { adminRole, roleError })

  if (roleError || !adminRole) {
    console.log("[v0] No admin role found, redirecting to unauthorized")
    redirect("/admin/unauthorized")
  }

  // Check for specific role if required
  if (requiredRole && adminRole.role !== requiredRole && adminRole.role !== "super_admin") {
    redirect("/admin/unauthorized")
  }

  return { user, role: adminRole.role }
}

export async function getAdminUser() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: adminRole } = await supabase.from("admin_roles").select("role").eq("user_id", user.id).single()

  if (!adminRole) return null

  return { user, role: adminRole.role }
}

export async function logAdminActivity(action: string, targetType?: string, targetId?: string, details?: any) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  try {
    await supabase.from("admin_activity_log").insert({
      admin_user_id: user.id,
      action,
      target_type: targetType,
      target_id: targetId,
      details,
    })
  } catch (error) {
    console.log("[v0] Admin activity logging failed:", error)
  }
}
