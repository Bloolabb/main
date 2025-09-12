import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface ModuleHeaderProps {
  module: any
  userProgress: any[]
}

export function ModuleHeader({ module, userProgress }: ModuleHeaderProps) {
  const totalLessons = module.lessons?.length || 0
  const completedLessons = userProgress.filter((p) => p.completed).length
  const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" className="text-gray-600 hover:text-gray-800">
        <Link href={`/learn/${module.learning_tracks?.id}`} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to {module.learning_tracks?.title}</span>
        </Link>
      </Button>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
            {module.order_index}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
            <p className="text-lg text-indigo-100 mb-4">{module.description}</p>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Module Progress</span>
                <span className="font-semibold">
                  {completedLessons} / {totalLessons} lessons completed
                </span>
              </div>
              <Progress value={progressPercent} className="h-2 bg-white bg-opacity-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
