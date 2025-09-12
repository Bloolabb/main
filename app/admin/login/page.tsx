"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      console.log("[v0] Attempting admin login for:", email)

      // First, authenticate the user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        console.log("[v0] Auth error:", authError)
        throw authError
      }

      console.log("[v0] User authenticated, checking admin role for user ID:", authData.user.id)

      // Check if user has admin role
      const { data: adminRole, error: roleError } = await supabase
        .from("admin_roles")
        .select("role")
        .eq("user_id", authData.user.id)
        .single()

      console.log("[v0] Admin role query result:", { adminRole, roleError })

      if (roleError || !adminRole) {
        console.log("[v0] No admin role found, signing out user")
        // Sign out the user if they're not an admin
        await supabase.auth.signOut()
        throw new Error(
          "Access denied. Admin privileges required. Please contact support if you should have admin access.",
        )
      }

      console.log("[v0] Admin access granted, redirecting to dashboard")

      await supabase.from("admin_activity_log").insert({
        admin_user_id: authData.user.id,
        action: "admin_login",
        details: { role: adminRole.role },
      })

      router.push("/admin/dashboard")
    } catch (error: unknown) {
      console.log("[v0] Login error:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Admin Access</CardTitle>
            <CardDescription className="text-slate-300">Secure login for bloolabb administrators</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">
                  Admin Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@bloolabb.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              {error && (
                <Alert variant="destructive" className="bg-red-900/50 border-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                {isLoading ? "Authenticating..." : "Access Admin Panel"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-slate-400 hover:text-slate-300 transition-colors">
                ← Back to bloolabb
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
