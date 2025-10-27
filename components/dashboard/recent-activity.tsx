import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, BookOpen, Sparkles, TrendingUp } from "lucide-react"

interface RecentActivityProps {
  progressData: any[]
}

export function RecentActivity({ progressData }: RecentActivityProps) {
  const recentLessons = progressData
    .filter((p) => p.completed_at)
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
    .slice(0, 5)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  if (recentLessons.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-linear-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Learning Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-linear-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300 font-medium">Your learning journey begins here!</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Complete your first lesson to see activity here.</p>
            </div>
            <Button asChild className="bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg">
              <Link href="/learn" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Start Learning
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          Recent Activity
          <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentLessons.map((lesson, index) => (
            <div 
              key={index} 
              className="flex items-center gap-4 p-4 bg-linear-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-300 group"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-linear-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white truncate">
                  {lesson.lessons?.title || "Lesson Completed"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {lesson.lessons?.modules?.learning_tracks?.title} • 
                  <span className="text-green-600 dark:text-green-400 font-semibold ml-1">
                    +{lesson.lessons?.xp_reward || 10} XP
                  </span>
                </p>
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400 font-medium bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                {formatDate(lesson.completed_at)}
              </div>
            </div>
          ))}
        </div>
        
        {recentLessons.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button asChild variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800">
              <Link href="/achievements" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                View All Achievements
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}