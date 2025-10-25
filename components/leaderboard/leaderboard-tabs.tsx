"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Zap, Flame, Calendar, Crown, Award, User } from "lucide-react"

interface LeaderboardTabsProps {
  currentUser: any
  xpLeaderboard: any[]
  streakLeaderboard: any[]
  weeklyLeaderboard: any[]
}

export function LeaderboardTabs({
  currentUser,
  xpLeaderboard,
  streakLeaderboard,
  weeklyLeaderboard,
}: LeaderboardTabsProps) {
  const [activeTab, setActiveTab] = useState("xp")

  const tabs = [
    { id: "xp", label: "Total XP", icon: Zap, data: xpLeaderboard, metric: "total_xp" },
    { id: "streak", label: "Current Streak", icon: Flame, data: streakLeaderboard, metric: "current_streak" },
    { id: "weekly", label: "This Week", icon: Calendar, data: weeklyLeaderboard, metric: "total_xp" },
  ]

  const activeTabData = tabs.find((tab) => tab.id === activeTab)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500 fill-yellow-400" />
      case 2:
        return <Award className="h-5 w-5 text-gray-400 fill-gray-300" />
      case 3:
        return <Award className="h-5 w-5 text-amber-700 fill-amber-600" />
      default:
        return `#${rank}`
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-linear-to-r from-yellow-400 to-yellow-500 text-white"
      case 2:
        return "bg-linear-to-r from-gray-300 to-gray-400 text-gray-800"
      case 3:
        return "bg-linear-to-r from-amber-600 to-amber-700 text-white"
      default:
        return "bg-[#F4F4F9] text-[#004AAD]"
    }
  }

  const getCurrentUserRank = () => {
    if (!currentUser || !activeTabData) return null
    const userIndex = activeTabData.data.findIndex((user) => user.id === currentUser.id)
    return userIndex >= 0 ? userIndex + 1 : null
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-3 justify-center">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              variant={isActive ? "default" : "outline"}
              className={`flex items-center space-x-2 rounded-full px-5 py-2 transition-all ${
                isActive 
                  ? "bg-linear-to-r from-[#6A0DAD] to-[#004AAD] text-white shadow-md" 
                  : "bg-white border-2 border-[#6A0DAD]/20 text-[#004AAD] hover:bg-[#6A0DAD]/10"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{tab.label}</span>
            </Button>
          )
        })}
      </div>

      {/* Current User Position */}
      {currentUser && (
        <Card className="border-2 border-[#6A0DAD]/30 bg-linear-to-r from-[#6A0DAD]/10 to-[#004AAD]/10 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-linear-to-r from-[#6A0DAD] to-[#004AAD] rounded-full flex items-center justify-center text-white font-bold">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-[#6A0DAD]">{currentUser.display_name} (You)</div>
                  <div className="text-sm text-[#004AAD]">
                    {activeTabData?.metric === "current_streak"
                      ? `${currentUser.current_streak} day streak`
                      : `${currentUser.total_xp} XP`}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-[#FF6B00]">
                  {getCurrentUserRank() ? `Rank #${getCurrentUserRank()}` : "Not ranked"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard */}
      <Card className="border-2 border-[#F4F4F9] shadow-lg overflow-hidden">
        <CardHeader className="bg-linear-to-r from-[#6A0DAD] to-[#004AAD] text-white py-4">
          <CardTitle className="text-xl flex items-center justify-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>{activeTabData?.label} Leaderboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[#F4F4F9]">
            {activeTabData?.data.slice(0, 20).map((user, index) => {
              const rank = index + 1
              const isCurrentUser = currentUser?.id === user.id
              const metricValue = activeTabData.metric === "current_streak" ? user.current_streak : user.total_xp
              const metricLabel = activeTabData.metric === "current_streak" ? "day streak" : "XP"

              return (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-4 transition-all ${
                    isCurrentUser 
                      ? "bg-linear-to-r from-[#FF6B00]/10 to-[#FF6B00]/5 border-l-4 border-[#FF6B00]" 
                      : "hover:bg-[#F4F4F9]"
                  } ${rank <= 3 ? "bg-linear-to-r from-[#6A0DAD]/5 to-[#004AAD]/5" : ""}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 flex items-center justify-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankBadgeColor(rank)}`}>
                        {rank <= 3 ? getRankIcon(rank) : rank}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-linear-to-r from-[#6A0DAD] to-[#004AAD] rounded-full flex items-center justify-center text-white font-bold">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <div className={`font-semibold ${isCurrentUser ? "text-[#FF6B00]" : "text-[#6A0DAD]"}`}>
                          {user.display_name}
                          {isCurrentUser && (
                            <Badge className="ml-2 bg-[#FF6B00] text-white hover:bg-[#FF6B00]/90">You</Badge>
                          )}
                        </div>
                        {user.current_streak > 0 && activeTab !== "streak" && (
                          <div className="text-xs text-[#FF6B00] flex items-center space-x-1 mt-1">
                            <Flame className="h-3 w-3" />
                            <span>{user.current_streak} day streak</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-md font-bold ${isCurrentUser ? "text-[#FF6B00]" : "text-[#004AAD]"}`}>
                      {metricValue.toLocaleString()} {metricLabel}
                    </div>
                    {activeTab === "xp" && user.current_streak > 0 && (
                      <div className="text-xs text-[#6A0DAD] mt-1">
                        {user.current_streak} day streak
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {activeTabData?.data.length === 0 && (
        <Card className="border-2 border-[#F4F4F9] bg-white">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4 text-[#6A0DAD]">📊</div>
            <h3 className="text-xl font-semibold text-[#6A0DAD] mb-2">No Data Available</h3>
            <p className="text-[#004AAD]">Be the first to start learning and appear on the leaderboard!</p>
            <Button className="mt-4 bg-linear-to-r from-[#6A0DAD] to-[#004AAD] hover:from-[#004AAD] hover:to-[#6A0DAD]">
              Start Learning
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}