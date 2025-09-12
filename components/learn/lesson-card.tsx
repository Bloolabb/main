import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Lock, Play } from "lucide-react"
import Link from "next/link"

interface LessonCardProps {
  lesson: any
  trackId: string
  moduleId: string
  isCompleted: boolean
  isUnlocked: boolean
  score?: number
}

export function LessonCard({ lesson, trackId, moduleId, isCompleted, isUnlocked, score }: LessonCardProps) {
  return (
    <Card
      className={`border-2 transition-all duration-200 ${
        isUnlocked ? "border-gray-200 hover:shadow-lg hover:scale-105" : "border-gray-100 opacity-60"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                isCompleted ? "bg-green-500" : isUnlocked ? "bg-blue-500" : "bg-gray-400"
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="h-5 w-5" />
              ) : isUnlocked ? (
                <Play className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{lesson.title}</h3>
              {lesson.description && <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>}
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span>+{lesson.xp_reward} XP</span>
                {isCompleted && score !== undefined && (
                  <span className="text-green-600 font-semibold">Score: {score}%</span>
                )}
              </div>
            </div>
          </div>

          {isUnlocked ? (
            <Button
              asChild
              size="sm"
              className={isCompleted ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"}
            >
              <Link href={`/learn/${trackId}/${moduleId}/${lesson.id}`}>{isCompleted ? "Review" : "Start"}</Link>
            </Button>
          ) : (
            <Button disabled size="sm" variant="outline">
              <Lock className="h-3 w-3 mr-1" />
              Locked
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
