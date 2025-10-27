import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Lock, CheckCircle, BookOpen } from "lucide-react"
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
      className={`border transition-all duration-200 ${
        isUnlocked 
          ? "border-gray-200 hover:border-purple-300 hover:shadow-md bg-white" 
          : "border-gray-100 bg-gray-50"
      } ${isCompleted ? "border-green-200 bg-green-50/30" : ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-semibold text-lg transition-colors ${
                isCompleted ? "bg-green-500 text-white" : 
                isUnlocked ? "bg-linear-to-r from-blue-500 to-cyan-500 text-white" : 
                "bg-gray-300 text-gray-500"
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
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl text-gray-900">{module.title}</CardTitle>
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">{module.description}</p>
            </div>
          </div>
          {!isUnlocked && (
            <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
              {module.unlock_xp_required} XP needed
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
                {completedLessons}/{totalLessons} lessons
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600 flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {totalLessons} lesson{totalLessons !== 1 ? "s" : ""}
          </div>

          {isUnlocked ? (
            <Button 
              asChild 
              className="bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 font-medium"
            >
              <Link href={`/learn/${trackId}/${module.id}`}>
                {completedLessons > 0 ? "Continue" : "Start"}
              </Link>
            </Button>
          ) : (
            <Button disabled variant="outline" className="text-gray-500 border-gray-300">
              <Lock className="h-4 w-4 mr-2" />
              Locked
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}