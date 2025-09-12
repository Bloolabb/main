import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

interface LearningTrackCardProps {
  track: any
  userProgress: any[]
}

export function LearningTrackCard({ track, userProgress }: LearningTrackCardProps) {
  const totalLessons = track.modules?.reduce((acc: number, module: any) => acc + (module.lessons?.length || 0), 0) || 0
  const completedLessons = userProgress.filter((p) => p.completed).length
  const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  const isAI = track.title.includes("AI")
  const cardColor = isAI ? "from-blue-500 to-purple-600" : "from-green-500 to-teal-600"
  const buttonColor = isAI ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"

  return (
    <Card className="border-2 border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <CardHeader className={`bg-gradient-to-r ${cardColor} text-white rounded-t-lg`}>
        <div className="flex items-center space-x-4">
          <div className="text-4xl">{track.icon}</div>
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold">{track.title}</CardTitle>
            <p className="text-blue-100 mt-2">{track.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-bold text-gray-800">
              {completedLessons} / {totalLessons} lessons
            </span>
          </div>
          <Progress value={progressPercent} className="h-3" />
          <div className="text-center text-sm text-gray-600">{Math.round(progressPercent)}% Complete</div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-800">{track.modules?.length || 0}</div>
            <div className="text-xs text-gray-600">Modules</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-800">{totalLessons}</div>
            <div className="text-xs text-gray-600">Lessons</div>
          </div>
        </div>

        <Button asChild className={`w-full h-12 text-lg font-semibold ${buttonColor}`}>
          <Link href={`/learn/${track.id}`}>{completedLessons > 0 ? "Continue Learning" : "Start Learning"}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
