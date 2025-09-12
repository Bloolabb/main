"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { LogOut, Save, User, Mail } from "lucide-react"

interface SettingsFormProps {
  user: any
  profile: any
}

export function SettingsForm({ user, profile }: SettingsFormProps) {
  const [displayName, setDisplayName] = useState(profile?.display_name || "")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      setMessage("Profile updated successfully!")
      router.refresh()
    } catch (error) {
      setMessage("Error updating profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleResetProgress = async () => {
    if (!confirm("Are you sure you want to reset all your progress? This cannot be undone.")) {
      return
    }

    setIsLoading(true)
    try {
      // Reset user progress
      await supabase.from("user_progress").delete().eq("user_id", user.id)

      // Reset user badges
      await supabase.from("user_badges").delete().eq("user_id", user.id)

      // Reset profile stats
      await supabase
        .from("profiles")
        .update({
          total_xp: 0,
          current_streak: 0,
          longest_streak: 0,
          last_activity_date: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      setMessage("Progress reset successfully!")
      router.refresh()
    } catch (error) {
      setMessage("Error resetting progress. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card className="border-2 border-gray-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Profile Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <Input id="email" type="email" value={user.email} disabled className="bg-gray-50 text-gray-500" />
              </div>
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-sm font-medium text-gray-700">
                Display Name
              </Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                className="border-2 border-gray-200 focus:border-blue-400"
              />
            </div>

            {message && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  message.includes("Error")
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "bg-green-50 text-green-600 border border-green-200"
                }`}
              >
                {message}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{isLoading ? "Saving..." : "Save Changes"}</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="border-2 border-gray-100 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-800">Account Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div>
                <h3 className="font-semibold text-yellow-800">Reset Progress</h3>
                <p className="text-sm text-yellow-700">Clear all learning progress and start fresh</p>
              </div>
              <Button
                onClick={handleResetProgress}
                disabled={isLoading}
                variant="outline"
                className="border-yellow-300 text-yellow-700 hover:bg-yellow-100 bg-transparent"
              >
                Reset
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div>
                <h3 className="font-semibold text-red-800">Sign Out</h3>
                <p className="text-sm text-red-700">Sign out of your account</p>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100 flex items-center space-x-2 bg-transparent"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
