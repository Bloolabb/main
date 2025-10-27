"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Zap, Flame, Trophy, Award, Sparkles } from "lucide-react"

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
        const { data } = await supabase
          .from("user_badges")
          .select("id")
          .eq("user_id", profile.id)
        setBadgeCount(data?.length || 0)
      }
      setIsLoading(false)
    }
    fetchBadgeCount()
  }, [profile?.id])

  const userLevel = Math.floor((profile?.total_xp || 0) / 100) + 1
  const currentLevelXp = (profile?.total_xp || 0) % 100

  const stats = [
    { 
      title: "Total XP", 
      value: profile?.total_xp || 0, 
      icon: Zap, 
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800"
    },
    { 
      title: "Day Streak", 
      value: profile?.current_streak || 0, 
      icon: Flame, 
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800",
      subtitle: `${profile?.longest_streak || 0} record`
    },
    { 
      title: "Badges", 
      value: badgeCount, 
      icon: Award, 
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800"
    },
    { 
      title: "Level", 
      value: userLevel, 
      icon: Trophy, 
      color: "from-amber-500 to-yellow-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      borderColor: "border-amber-200 dark:border-amber-800",
      subtitle: `${currentLevelXp}/100 to next`
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl h-32 border-0" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 px-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card 
            key={stat.title}
            className={`
              group relative overflow-hidden border-0 shadow-sm hover:shadow-2xl 
              transition-all duration-500 hover:scale-105
              ${stat.bgColor} ${stat.borderColor}
            `}
          >
            {/* Animated background sparkle */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <Sparkles className="h-4 w-4 text-current animate-pulse" />
            </div>
            
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-3 rounded-2xl bg-linear-to-r ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className={`text-sm font-semibold bg-linear-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.title}
                  </div>
                </div>
                
                {stat.subtitle && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {stat.subtitle}
                  </div>
                )}
              </div>
            </CardContent>

            {/* Hover effect overlay */}
            <div className={`absolute inset-0 bg-linear-to-r ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
          </Card>
        )
      })}
    </div>
  )
}