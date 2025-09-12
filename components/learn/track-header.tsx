import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface TrackHeaderProps {
  track: any
  userProgress: any[]
}

export function TrackHeader({ track, userProgress }: TrackHeaderProps) {
  const totalLessons = track.modules?.reduce((acc: number, module: any) => acc + (module.lessons?.length || 0), 0) || 0
  const completedLessons = userProgress.filter((p) => p.completed).length
  const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  const isAI = track.title.includes("AI")
  const gradientColor = isAI ? "from-blue-500 to-purple-600" : "from-green-500 to-teal-600"

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" className="text-gray-600 hover:text-gray-800">
        <Link href="/learn" className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Learning Paths</span>
        </Link>
      </Button>

      <div className={`bg-gradient-to-r ${gradientColor} text-white rounded-xl p-8`}>
        <div className="flex items-center space-x-6">
          <div className="text-6xl">{track.icon}</div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{track.title}</h1>
            <p className="text-xl text-blue-100 mb-4">{track.description}</p>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Your Progress</span>
                <span className="font-semibold">
                  {completedLessons} / {totalLessons} lessons completed
                </span>
              </div>
              <Progress value={progressPercent} className="h-3 bg-white bg-opacity-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
