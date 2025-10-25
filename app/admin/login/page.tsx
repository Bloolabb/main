"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useCallback } from "react"

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Handle input changes
  const handleInputChange = useCallback((field: keyof typeof formData) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }))
      // Clear error when user starts typing
      if (error) setError(null)
    }, [error])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    if (!formData.email.includes('@')) {
      setError("Please enter a valid email address")
      return
    }

    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      // First, authenticate the user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      })

      if (authError) {
        throw new Error(
          authError.message === "Invalid login credentials" 
            ? "Invalid email or password. Please check your credentials."
            : authError.message
        )
      }

      if (!authData.user) {
        throw new Error("Authentication failed. Please try again.")
      }

      // Check if user has admin role with timeout
      const adminCheckPromise = supabase
        .from("admin_roles")
        .select("role")
        .eq("user_id", authData.user.id)
        .single()

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Admin verification timeout")), 10000)
      )

      const { data: adminRole, error: roleError } = await Promise.race([
        adminCheckPromise,
        timeoutPromise
      ]) as any

      if (roleError || !adminRole) {
        // Sign out the user if they're not an admin
        await supabase.auth.signOut()
        throw new Error(
          "Access denied. Admin privileges required. Please contact system administrator."
        )
      }

      // Log admin login activity (fire and forget)
      supabase.from("admin_activity_log").insert({
        admin_user_id: authData.user.id,
        action: "admin_login",
        details: { role: adminRole.role },
      }).then(({ error }) => {
        if (error) console.error("Failed to log admin activity")
      })

      // Redirect to admin dashboard
      router.push("/admin/dashboard")
      router.refresh() // Refresh to ensure auth state is updated

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-linear-to-r from-red-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-white to-slate-200 bg-clip-text text-transparent">
            Admin Portal
          </h1>
          <p className="text-slate-400 text-lg">Secure access for authorized administrators</p>
        </div>

        {/* Login Card */}
        <Card className="border-slate-700 bg-slate-800/60 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-slate-200 font-medium text-sm">
                  Admin Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter admin email"
                  required
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-red-500 transition-colors h-11"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-slate-200 font-medium text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    className="bg-slate-700/50 border-slate-600 text-white pr-10 focus:border-red-500 transition-colors h-11"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert className="bg-red-900/30 border-red-700/50 animate-in fade-in duration-300">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-200 text-sm">{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-linear-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold h-11 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Authenticating...
                  </>
                ) : (
                  "Access Admin Panel"
                )}
              </Button>
            </form>

            {/* Back Link */}
            <div className="mt-6 pt-5 border-t border-slate-700">
              <Link 
                href="/" 
                className="w-full flex items-center justify-center text-sm text-slate-400 hover:text-slate-300 transition-colors group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                <span className="ml-2">Back to main site</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-slate-500">
            🔒 Restricted access - Authorized personnel only
          </p>
          <p className="text-xs text-slate-600 mt-1">
            All access attempts are logged and monitored
          </p>
        </div>
      </div>
    </div>
  )
}
