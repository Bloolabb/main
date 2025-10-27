import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Star, Sparkles, Play } from "lucide-react"

interface LearningTrack {
  id: string
  title: string
  description: string
  icon?: string
  total_lessons: number
  color?: string
}

interface LearningTracksOverviewProps {
  tracks: LearningTrack[]
  progressData: any[]
}

export function LearningTracksOverview({ tracks, progressData }: LearningTracksOverviewProps) {
  const getTrackProgress = (trackId: string) => {
    return progressData.filter((p) => p.lessons?.modules?.learning_tracks?.id === trackId).length
  }

  const trackColors = [
    { from: "from-purple-500", to: "to-blue-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { from: "from-blue-500", to: "to-cyan-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { from: "from-green-500", to: "to-emerald-500", bg: "bg-green-50 dark:bg-green-900/20" },
    { from: "from-orange-500", to: "to-red-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Learning Paths
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Choose your adventure and unlock new skills
          </p>
        </div>
        <Button asChild className="bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <Link href="/learn" className="flex items-center gap-2">
            Explore All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {tracks.map((track, index) => {
          const color = trackColors[index % trackColors.length]
          const completed = getTrackProgress(track.id)
          const total = track.total_lessons || 18
          const progress = Math.min((completed / total) * 100, 100)
          const isCompleted = completed >= total
          const isStarted = completed > 0

          return (
            <Card
              key={track.id}
              className={`
                group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl 
                transition-all duration-500 hover:scale-105
                ${color.bg}
              `}
            >
              {/* Animated background */}
              <div className={`absolute inset-0 bg-linear-to-br ${color.from} ${color.to} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-start gap-4">
                  <div className={`
                    p-4 rounded-2xl shadow-lg transition-all duration-500 group-hover:scale-110
                    bg-linear-to-r ${color.from} ${color.to}
                  `}>
                    <div className="text-xl text-white">
                      {track.icon || (isCompleted ? '🎯' : '📚')}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                      {track.title}
                      {isCompleted && (
                        <Star className="h-5 w-5 text-amber-500 fill-current animate-pulse" />
                      )}
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {track.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4 relative z-10">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Your Progress</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {completed}/{total} lessons
                    </span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-3 rounded-full bg-linear-to-r ${color.from} ${color.to} shadow-sm transition-all duration-1000 ease-out`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    {isCompleted && (
                      <div className="absolute -top-1 -right-1">
                        <div className="bg-linear-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
                          ✓
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    {isCompleted ? (
                      <span className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                        <Sparkles className="h-4 w-4" />
                        Mastered!
                      </span>
                    ) : isStarted ? (
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {Math.round(progress)}% complete
                      </span>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">Ready to begin</span>
                    )}
                  </div>
                  
                  <Button
                    asChild
                    size="sm"
                    className={`
                      font-semibold shadow-md hover:shadow-lg transition-all duration-300
                      bg-linear-to-r ${color.from} ${color.to} hover:scale-105
                    `}
                  >
                    <Link href={`/learn/${track.id}`} className="flex items-center gap-1">
                      {isCompleted ? 'Review' : isStarted ? 'Continue' : 'Start'}
                      <Play className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}