"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"


export default function LoginPage() {
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
      // User authentication
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (authError) throw authError

      // After successful login, update login streak
      const { data: userData } = await supabase.auth.getUser()
      if (userData?.user) {
        // First, get the current profile to check the last activity date
        const { data: profile, error: fetchError } = await supabase
          .from("profiles")
          .select("current_streak, longest_streak, last_activity_date")
          .eq("id", userData.user.id)
          .single()

        if (fetchError) throw fetchError

        // Calculate new streak
        const today = new Date()
        const todayDate = today.toISOString().split('T')[0] // Get YYYY-MM-DD format
        const lastActivityDate = profile?.last_activity_date
        
        let newCurrentStreak = profile?.current_streak || 0
        const currentLongestStreak = profile?.longest_streak || 0

        if (lastActivityDate) {
          const lastActivity = new Date(lastActivityDate)
          const yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)
          
          const isConsecutiveDay = lastActivity.toDateString() === yesterday.toDateString()
          const isSameDay = lastActivity.toDateString() === today.toDateString()
          
          if (isConsecutiveDay) {
            // Consecutive day - increment streak
            newCurrentStreak += 1
          } else if (!isSameDay) {
            // Not consecutive and not same day - reset streak to 1
            newCurrentStreak = 1
          }
          // If same day, keep the current streak unchanged
        } else {
          // First time login or no last activity date
          newCurrentStreak = 1
        }

        // Calculate new longest streak
        const newLongestStreak = Math.max(currentLongestStreak, newCurrentStreak)

        // Update the profile with new streaks and last activity
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            current_streak: newCurrentStreak,
            longest_streak: newLongestStreak,
            last_activity_date: todayDate,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userData.user.id)

        if (updateError) throw updateError
      }

      router.push("/dashboard")
      router.refresh()

    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-2 border-blue-200 shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="text-4xl">👋</div>
            <CardTitle className="text-2xl font-bold text-blue-600">Welcome Back!</CardTitle>
            <CardDescription className="text-gray-600">Continue your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-2 border-gray-200 focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-2 border-gray-200 focus:border-blue-400"
                />
              </div>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              <Button
                type="submit"
                className="w-full h-12 text-lg bg-blue-500 hover:bg-blue-600 font-semibold"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/auth/sign-up" className="font-semibold text-blue-600 hover:text-blue-700 underline">
                  Sign up for free
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
