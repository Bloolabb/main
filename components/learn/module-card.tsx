import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Lock, CheckCircle } from "lucide-react"
import Link from "next/link"

interface ModuleCardProps {
  module: any
  trackId: string
  isUnlocked: boolean
  userProgress: any[]
  moduleIndex: number
}

export function ModuleCard({ module, trackId, isUnlocked, userProgress, moduleIndex }: ModuleCardProps) {
  const totalLessons = module.lessons?.length || 0
  const completedLessons = userProgress.filter((p) => p.completed).length
  const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
  const isCompleted = completedLessons === totalLessons && totalLessons > 0

  return (
    <Card
      className={`border-2 shadow-lg transition-all duration-200 ${
        isUnlocked ? "border-gray-200 hover:shadow-xl hover:scale-105" : "border-gray-100 opacity-60"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                isCompleted ? "bg-green-500" : isUnlocked ? "bg-blue-500" : "bg-gray-400"
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="h-6 w-6" />
              ) : isUnlocked ? (
                moduleIndex + 1
              ) : (
                <Lock className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl text-gray-800">{module.title}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{module.description}</p>
            </div>
          </div>
          {!isUnlocked && (
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Requires {module.unlock_xp_required} XP
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isUnlocked && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold text-gray-800">
                {completedLessons} / {totalLessons} lessons
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {totalLessons} lesson{totalLessons !== 1 ? "s" : ""}
          </div>

          {isUnlocked ? (
            <Button asChild className="bg-blue-500 hover:bg-blue-600">
              <Link href={`/learn/${trackId}/${module.id}`}>{completedLessons > 0 ? "Continue" : "Start"}</Link>
            </Button>
          ) : (
            <Button disabled variant="outline">
              <Lock className="h-4 w-4 mr-2" />
              Locked
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
