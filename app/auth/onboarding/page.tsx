"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

const learningTracks = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    title: "AI Fundamentals",
    description: "Master the basics of Artificial Intelligence and Machine Learning",
    icon: "🤖",
    color: "blue",
    gradient: "from-blue-400 to-blue-600",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    title: "Entrepreneurship Basics",
    description: "Learn essential skills for starting and running a business",
    icon: "💼",
    color: "green",
    gradient: "from-green-400 to-green-600",
  },
]

export default function OnboardingPage() {
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth/login")
          return
        }
        setUser(user)
      } catch (error) {
        console.error("Error fetching user:", error)
        router.push("/auth/login")
      } finally {
        setIsInitializing(false)
      }
    }
    getUser()
  }, [router, supabase.auth])

  const handleTrackSelection = async () => {
    if (!selectedTrack || !user) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          preferred_track_id: selectedTrack,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      router.push("/dashboard")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("There was an error setting up your profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 to-cyan-50 flex items-center justify-center">
        <Card className="w-full max-w-md p-8 text-center">
          <CardContent>
            <div className="text-4xl mb-4">⌛</div>
            <CardTitle className="text-xl font-bold text-indigo-600 mb-2">
              Setting Up Your Journey
            </CardTitle>
            <CardDescription>Just a moment while we prepare your experience...</CardDescription>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-2 border-indigo-200 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="text-6xl">🎯</div>
            <CardTitle className="text-3xl font-bold text-indigo-600">Choose Your Adventure!</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Which learning path excites you most? You can always explore both later!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              {learningTracks.map((track) => (
                <Card
                  key={track.id}
                  className={`cursor-pointer transition-all duration-200 border-2 ${
                    selectedTrack === track.id
                      ? `border-${track.color}-400 bg-${track.color}-50 shadow-lg scale-105`
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }`}
                  onClick={() => !isLoading && setSelectedTrack(track.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{track.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800">{track.title}</h3>
                        <p className="text-gray-600 mt-1">{track.description}</p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 ${
                          selectedTrack === track.id
                            ? `bg-${track.color}-500 border-${track.color}-500`
                            : "border-gray-300"
                        }`}
                      >
                        {selectedTrack === track.id && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              onClick={handleTrackSelection}
              disabled={!selectedTrack || isLoading}
              isLoading={isLoading}
              className="w-full h-12 text-lg bg-indigo-500 hover:bg-indigo-600 font-semibold disabled:opacity-50"
            >
              Start Learning!
            </Button>

            <p className="text-center text-sm text-gray-500">
              Don't worry - you can switch tracks or explore both anytime from your dashboard
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
