import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Lock, Play, Zap } from "lucide-react"
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
      className={`border transition-all duration-200 ${
        isUnlocked 
          ? "border-gray-200 hover:border-purple-300 hover:shadow-md bg-white" 
          : "border-gray-100 bg-gray-50"
      } ${isCompleted ? "border-green-200 bg-green-50/30" : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                isCompleted ? "bg-green-500 text-white" : 
                isUnlocked ? "bg-linear-to-r from-blue-500 to-cyan-500 text-white" : 
                "bg-gray-300 text-gray-500"
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="h-6 w-6" />
              ) : isUnlocked ? (
                <Play className="h-5 w-5" />
              ) : (
                <Lock className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
              {lesson.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{lesson.description}</p>
              )}
              <div className="flex items-center space-x-4 mt-2 text-xs">
                <span className="flex items-center gap-1 text-amber-600 font-semibold">
                  <Zap className="h-3 w-3" />
                  +{lesson.xp_reward} XP
                </span>
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
              className={`
                font-medium transition-all
                ${isCompleted 
                  ? "bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600" 
                  : "bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                }
              `}
            >
              <Link href={`/learn/${trackId}/${moduleId}/${lesson.id}`}>
                {isCompleted ? "Review" : "Start"}
              </Link>
            </Button>
          ) : (
            <Button disabled size="sm" variant="outline" className="text-gray-500 border-gray-300">
              <Lock className="h-3 w-3 mr-1" />
              Locked
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}