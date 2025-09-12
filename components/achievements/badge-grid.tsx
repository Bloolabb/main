"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { BadgeModal } from "./badge-modal"

interface BadgeGridProps {
  allBadges: any[]
  userBadges: any[]
  profile: any
  userProgress: any[]
  userId: string
}

export function BadgeGrid({ allBadges, userBadges, profile, userProgress, userId }: BadgeGridProps) {
  const [selectedBadge, setSelectedBadge] = useState<any>(null)
  const [newlyEarnedBadges, setNewlyEarnedBadges] = useState<string[]>([])
  const supabase = createClient()

  const earnedBadgeIds = userBadges.map((ub) => ub.badge_id)

  // Check for newly earned badges
  useEffect(() => {
    const checkNewBadges = async () => {
      const newBadges: string[] = []

      for (const badge of allBadges) {
        if (earnedBadgeIds.includes(badge.id)) continue

        let shouldEarn = false

        switch (badge.condition_type) {
          case "xp_milestone":
            shouldEarn = (profile?.total_xp || 0) >= badge.condition_value
            break
          case "streak":
            shouldEarn = (profile?.current_streak || 0) >= badge.condition_value
            break
          case "lessons_completed":
            shouldEarn = userProgress.length >= badge.condition_value
            break
          case "track_completed":
            // This would need more complex logic to check if a full track is completed
            break
        }

        if (shouldEarn) {
          try {
            const { error } = await supabase.from("user_badges").insert({
              user_id: userId,
              badge_id: badge.id,
            })

            if (!error) {
              newBadges.push(badge.id)
            }
          } catch (error) {
            console.error("Error awarding badge:", error)
          }
        }
      }

      if (newBadges.length > 0) {
        setNewlyEarnedBadges(newBadges)
      }
    }

    checkNewBadges()
  }, [allBadges, earnedBadgeIds, profile, userProgress, userId, supabase])

  const getBadgeProgress = (badge: any) => {
    switch (badge.condition_type) {
      case "xp_milestone":
        return Math.min((profile?.total_xp || 0) / badge.condition_value, 1)
      case "streak":
        return Math.min((profile?.current_streak || 0) / badge.condition_value, 1)
      case "lessons_completed":
        return Math.min(userProgress.length / badge.condition_value, 1)
      default:
        return 0
    }
  }

  const isEarned = (badgeId: string) => earnedBadgeIds.includes(badgeId) || newlyEarnedBadges.includes(badgeId)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allBadges.map((badge) => {
          const earned = isEarned(badge.id)
          const progress = getBadgeProgress(badge)
          const isNew = newlyEarnedBadges.includes(badge.id)

          return (
            <Card
              key={badge.id}
              className={`cursor-pointer transition-all duration-200 border-2 ${
                earned
                  ? "border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg hover:shadow-xl"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
              } ${isNew ? "animate-pulse" : ""}`}
              onClick={() => setSelectedBadge(badge)}
            >
              <CardContent className="p-4 text-center space-y-3">
                <div className="relative">
                  <div
                    className={`text-4xl ${earned ? "grayscale-0" : "grayscale opacity-50"} transition-all duration-200`}
                  >
                    {badge.icon}
                  </div>
                  {earned ? (
                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="absolute -top-1 -right-1 bg-gray-400 rounded-full p-1">
                      <Lock className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {isNew && (
                    <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs">
                      NEW!
                    </Badge>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className={`font-semibold ${earned ? "text-yellow-700" : "text-gray-600"}`}>{badge.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{badge.description}</p>
                </div>

                {!earned && (
                  <div className="space-y-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">{Math.round(progress * 100)}% complete</div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedBadge && (
        <BadgeModal
          badge={selectedBadge}
          isEarned={isEarned(selectedBadge.id)}
          progress={getBadgeProgress(selectedBadge)}
          onClose={() => setSelectedBadge(null)}
        />
      )}
    </>
  )
}
