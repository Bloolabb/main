import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { BookOpen, Target, Sparkles } from "lucide-react"

interface LearningTrackCardProps {
  track: any
  userProgress: any[]
}

export function LearningTrackCard({ track, userProgress }: LearningTrackCardProps) {
  const totalLessons = track.modules?.reduce((acc: number, module: any) => acc + (module.lessons?.length || 0), 0) || 0
  const completedLessons = userProgress.filter((p) => p.completed).length
  const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
  const isCompleted = completedLessons === totalLessons && totalLessons > 0

  return (
    <Card className="border border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:border-purple-200">
      <CardHeader className="pb-4">
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-2xl ${isCompleted ? 'bg-linear-to-r from-purple-500 to-blue-500' : 'bg-gray-100'} transition-colors`}>
            <div className="text-2xl">
              {track.icon || '📚'}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
              {track.title}
              {isCompleted && <Sparkles className="h-5 w-5 text-amber-500" />}
            </CardTitle>
            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
              {track.description}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 font-medium">Progress</span>
            <span className="font-semibold text-gray-800">
              {completedLessons}/{totalLessons} lessons
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                isCompleted ? 'bg-linear-to-r from-purple-500 to-blue-500' : 'bg-linear-to-r from-blue-500 to-cyan-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="text-lg font-bold text-gray-800">{track.modules?.length || 0}</div>
            <div className="text-xs text-gray-600">Modules</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="text-lg font-bold text-gray-800">{totalLessons}</div>
            <div className="text-xs text-gray-600">Lessons</div>
          </div>
        </div>

        <Button 
          asChild 
          className={`w-full font-semibold transition-all ${
            isCompleted 
              ? 'bg-linear-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600' 
              : 'bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
          }`}
        >
          <Link href={`/learn/${track.id}`} className="flex items-center justify-center gap-2">
            {isCompleted ? 'Review' : completedLessons > 0 ? 'Continue' : 'Start Learning'}
            <BookOpen className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}