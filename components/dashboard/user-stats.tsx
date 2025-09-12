"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Zap, Flame, Trophy, Award } from "lucide-react"

interface UserStatsProps {
  profile: any
}

export function UserStats({ profile }: UserStatsProps) {
  const [badgeCount, setBadgeCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchBadgeCount = async () => {
      if (profile?.id) {
        const { data } = await supabase.from("user_badges").select("id").eq("user_id", profile.id)
        setBadgeCount(data?.length || 0)
        setIsLoading(false)
      }
    }
    fetchBadgeCount()
  }, [profile?.id, supabase])

  const stats = [
    {
      title: "XP",
      value: profile?.total_xp || 0,
      icon: Zap,
      color: "#004AAD",
    },
    {
      title: "Streak",
      value: profile?.current_streak || 0,
      icon: Flame,
      color: "#FF6B00",
      subtitle: `${profile?.longest_streak || 0} record`,
    },
    {
      title: "Badges",
      value: badgeCount,
      icon: Award,
      color: "#6A0DAD",
    },
    {
      title: "Level",
      value: Math.floor((profile?.total_xp || 0) / 1000) + 1,
      icon: Trophy,
      color: "#FF6B00",
      subtitle: `${(profile?.total_xp || 0) % 1000}/1000 to next`,
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4"> {/* Grid layout with gap-6 and padding */}
        {[...Array(4)].map((_, index) => (
          <div key={index} className="animate-pulse bg-gray-200 rounded-2xl h-32 w-full"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4"> {/* Grid layout with gap-6 and padding */}
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card 
            key={index} 
            className="bg-white border-2 border-[#F4F4F9] rounded-2xl p-5 w-full shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
          >
            <CardContent className="p-0 flex flex-col items-center text-center space-y-4"> {/* Increased space-y to 4 */}
              <div 
                className="p-3 rounded-full" 
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <Icon className="h-6 w-6" style={{ color: stat.color }} />
              </div>
              
              <div className="space-y-2"> {/* Increased space-y to 2 */}
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm font-medium" style={{ color: stat.color }}>{stat.title}</div>
              </div>
              
              {stat.subtitle && (
                <div className="text-xs text-gray-500 pt-2">{stat.subtitle}</div> /* Increased pt to 2 */
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}