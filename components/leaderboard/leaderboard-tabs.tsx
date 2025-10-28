"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Zap, Flame, Calendar, Crown, Award, User, Sparkles } from "lucide-react"

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
        return "bg-linear-to-r from-yellow-400 to-yellow-500 text-white shadow-lg"
      case 2:
        return "bg-linear-to-r from-gray-300 to-gray-400 text-gray-800 shadow-md"
      case 3:
        return "bg-linear-to-r from-amber-600 to-amber-700 text-white shadow-md"
      default:
        return "bg-white/80 text-[#004AAD] border border-[#004AAD]/20 backdrop-blur-sm"
    }
  }

  const getCurrentUserRank = () => {
    if (!currentUser || !activeTabData) return null
    const userIndex = activeTabData.data.findIndex((user) => user.id === currentUser.id)
    return userIndex >= 0 ? userIndex + 1 : null
  }

  return (
    <div className="min-h-screenrelative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-300 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main SVG Background - Positioned as decorative element */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl opacity-20">
        <div 
          className="w-full h-48"
          style={{
            backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 764 249'><path d='M 312.32 236.168 C 374.212 236.168 458.166 192.366 485.733 130.273 L 503.741 142.939 C 491.7 149.454 487.57 183.471 516.598 220.966 C 561.989 279.599 628.688 236.168 702.797 236.168 C 762.08 236.168 765.542 254.072 763.07 269.273 C 532.692 268.36 121.317 266.617 22.433 267.637 C 16.278 268.581 9.876 268.935 3.172 268.535 C -3.774 268.121 3.754 267.83 22.433 267.637 C 66.461 260.883 97.887 223.889 137.151 215.854 C 191.514 204.728 235.249 236.168 312.32 236.168 Z' fill='rgb(59,130,246)'></path></svg>")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Learning Leaderboard
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Compete with fellow learners and climb your way to the top! Track your progress and achievements.
          </p>
        </div>

        <div className="space-y-6">
          {/* Tab Navigation */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-3 justify-center">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <Button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      variant={isActive ? "default" : "outline"}
                      className={`flex items-center space-x-2 rounded-full px-6 py-3 transition-all duration-300 transform hover:scale-105 ${
                        isActive 
                          ? "bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
                          : "bg-white/60 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-semibold">{tab.label}</span>
                      {isActive && <Sparkles className="h-3 w-3 animate-pulse" />}
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Current User Position */}
          {currentUser && (
            <Card className="bg-linear-to-r from-blue-500/10 to-purple-600/10 backdrop-blur-sm border border-blue-200/30 shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg">
                        <User className="h-6 w-6" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-linear-to-r from-orange-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        YOU
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-xl text-gray-800">{currentUser.display_name}</div>
                      <div className="text-sm text-gray-600 flex items-center space-x-2">
                        <span>
                          {activeTabData?.metric === "current_streak"
                            ? `${currentUser.current_streak} day streak`
                            : `${currentUser.total_xp.toLocaleString()} XP`}
                        </span>
                        {currentUser.current_streak > 0 && activeTab !== "streak" && (
                          <>
                            <span>•</span>
                            <div className="flex items-center space-x-1 text-orange-500">
                              <Flame className="h-3 w-3" />
                              <span>{currentUser.current_streak} streak</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold bg-linear-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                      {getCurrentUserRank() ? `Rank #${getCurrentUserRank()}` : "Not ranked"}
                    </div>
                    <div className="text-sm text-gray-500">Global Position</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Leaderboard */}
          <Card className="bg-white/90 backdrop-blur-sm border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-linear-to-r from-blue-500 to-purple-600 text-white py-6">
              <CardTitle className="text-2xl flex items-center justify-center space-x-3">
                <Trophy className="h-6 w-6" />
                <span>{activeTabData?.label} Leaderboard</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100/50">
                {activeTabData?.data.slice(0, 20).map((user, index) => {
                  const rank = index + 1
                  const isCurrentUser = currentUser?.id === user.id
                  const metricValue = activeTabData.metric === "current_streak" ? user.current_streak : user.total_xp
                  const metricLabel = activeTabData.metric === "current_streak" ? "day streak" : "XP"

                  return (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between p-6 transition-all duration-300 hover:bg-blue-50/50 ${
                        isCurrentUser 
                          ? "bg-linear-to-r from-orange-50 to-orange-100/50 border-l-4 border-orange-400 shadow-inner" 
                          : ""
                      } ${rank <= 3 ? "bg-linear-to-r from-blue-50/80 to-purple-50/80" : ""}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg ${getRankBadgeColor(rank)}`}>
                            {rank <= 3 ? getRankIcon(rank) : rank}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-linear-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <div className={`font-bold text-lg ${isCurrentUser ? "text-orange-600" : "text-gray-800"}`}>
                              {user.display_name}
                              {isCurrentUser && (
                                <Badge className="ml-3 bg-linear-to-r from-orange-400 to-orange-500 text-white border-0 shadow-lg">
                                  You
                                </Badge>
                              )}
                            </div>
                            {user.current_streak > 0 && activeTab !== "streak" && (
                              <div className="text-sm text-orange-500 flex items-center space-x-1 mt-1">
                                <Flame className="h-3 w-3" />
                                <span>{user.current_streak} day streak</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${isCurrentUser ? "text-orange-600" : "text-blue-600"}`}>
                          {metricValue.toLocaleString()} {metricLabel}
                        </div>
                        {activeTab === "xp" && user.current_streak > 0 && (
                          <div className="text-sm text-purple-500 mt-1 flex items-center justify-end space-x-1">
                            <Flame className="h-3 w-3" />
                            <span>{user.current_streak} day streak</span>
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
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-3xl text-center">
              <CardContent className="p-12">
                <div className="text-6xl mb-6 text-blue-400">📊</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">No Data Available</h3>
                <p className="text-gray-600 text-lg mb-6">Be the first to start learning and appear on the leaderboard!</p>
                <Button className="bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
                  Start Learning Journey
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}