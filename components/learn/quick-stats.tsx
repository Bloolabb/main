// components/learn/quick-stats.tsx
interface QuickStatsProps {
  userProgress: Array<{
    completed: boolean
    score?: number
  }>
  profile: {
    total_xp?: number
    level?: number
  } | null
  achievements: Array<{
    unlocked: boolean
  }>
}

export function QuickStats({ userProgress, profile, achievements }: QuickStatsProps) {
  const completedLessons = userProgress.filter(p => p.completed).length
  const totalXP = profile?.total_xp || 0
  const currentLevel = profile?.level || 1
  const unlockedAchievements = achievements.filter(a => a.unlocked).length
  const averageScore = completedLessons > 0 
    ? Math.round(userProgress.filter(p => p.completed).reduce((acc, p) => acc + (p.score || 0), 0) / completedLessons)
    : 0

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
        <div className="text-2xl font-bold">{completedLessons}</div>
        <div className="text-sm opacity-90">Lessons Completed</div>
        <div className="text-xs opacity-75 mt-1">Keep learning!</div>
      </div>
      
      <div className="bg-linear-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
        <div className="text-2xl font-bold">{totalXP}</div>
        <div className="text-sm opacity-90">Total XP</div>
        <div className="text-xs opacity-75 mt-1">Level {currentLevel}</div>
      </div>
      
      <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
        <div className="text-2xl font-bold">{unlockedAchievements}</div>
        <div className="text-sm opacity-90">Achievements</div>
        <div className="text-xs opacity-75 mt-1">Great work!</div>
      </div>
    </div>
  )
}