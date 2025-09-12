import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface RecentActivityProps {
  progressData: any[]
}

export function RecentActivity({ progressData }: RecentActivityProps) {
  // Get the most recent completed lessons
  const recentLessons = progressData
    .filter((p) => p.completed_at)
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
    .slice(0, 5)

  if (recentLessons.length === 0) {
    return (
      <Card className="border-2 border-gray-100 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800 flex items-center space-x-2">
            <span>📈</span>
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎯</div>
            <p className="text-gray-600">No lessons completed yet!</p>
            <p className="text-sm text-gray-500 mt-2">Start learning to see your progress here.</p>
            <Button asChild className="mt-4 bg-blue-500 hover:bg-blue-600">
              <Link href="/learn">Start Learning</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-gray-100 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-gray-800 flex items-center space-x-2">
          <span>📈</span>
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentLessons.map((lesson, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">✓</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{lesson.lessons?.title || "Lesson Completed"}</p>
                <p className="text-sm text-gray-600">
                  {lesson.lessons?.modules?.learning_tracks?.title} • +{lesson.lessons?.xp_reward || 10} XP
                </p>
              </div>
              <div className="text-xs text-gray-500">{new Date(lesson.completed_at).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
