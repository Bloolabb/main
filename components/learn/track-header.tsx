import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { ArrowLeft, BookOpen, Target } from "lucide-react"

interface TrackHeaderProps {
  track: any
  userProgress: any[]
}

export function TrackHeader({ track, userProgress }: TrackHeaderProps) {
  const totalLessons = track.modules?.reduce((acc: number, module: any) => acc + (module.lessons?.length || 0), 0) || 0
  const completedLessons = userProgress.filter((p) => p.completed).length
  const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  return (
    <div className="space-y-6 p-2">
      <Button asChild variant="ghost" className="text-gray-600 hover:text-gray-800 hover:bg-gray-100">
        <Link href="/learn" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Learning Paths
        </Link>
      </Button>

      <div className="bg-linear-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-8">
        <div className="flex items-start gap-6">
          <div className="text-5xl shrink-0">
            {track.icon || '📚'}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold mb-3">{track.title}</h1>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">{track.description}</p>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Your Progress</span>
                <span className="font-semibold">
                  {completedLessons}/{totalLessons} lessons completed
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2.5">
                <div 
                  className="h-2.5 rounded-full bg-linear-to-r from-amber-400 to-amber-300 transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}