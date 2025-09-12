import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface AchievementStatsProps {
  profile: any
  userBadges: any[]
  totalBadges: number
  userProgress: any[]
}

export function AchievementStats({ profile, userBadges, totalBadges, userProgress }: AchievementStatsProps) {
  const badgeProgress = totalBadges > 0 ? (userBadges.length / totalBadges) * 100 : 0

  const stats = [
    {
      title: "Badges Earned",
      value: `${userBadges.length}/${totalBadges}`,
      icon: "🏆",
      color: "from-yellow-400 to-orange-500",
      progress: badgeProgress,
    },
    {
      title: "Total XP",
      value: profile?.total_xp || 0,
      icon: "⚡",
      color: "from-blue-400 to-purple-500",
    },
    {
      title: "Current Streak",
      value: `${profile?.current_streak || 0} days`,
      icon: "🔥",
      color: "from-red-400 to-pink-500",
    },
    {
      title: "Lessons Completed",
      value: userProgress.length,
      icon: "📚",
      color: "from-green-400 to-teal-500",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-2 border-gray-100 shadow-lg">
          <CardContent className="p-4 text-center space-y-3">
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${stat.color}`}
            >
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </div>
            {stat.progress !== undefined && (
              <div className="space-y-1">
                <Progress value={stat.progress} className="h-2" />
                <div className="text-xs text-gray-500">{Math.round(stat.progress)}% complete</div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
