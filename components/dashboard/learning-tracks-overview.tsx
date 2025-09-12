import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"

interface LearningTracksOverviewProps {
  tracks: any[]
  progressData: any[]
}

export function LearningTracksOverview({ tracks, progressData }: LearningTracksOverviewProps) {
  // Calculate progress for each track
  const getTrackProgress = (trackId: string) => {
    const trackLessons = progressData.filter((p) => p.lessons?.modules?.learning_tracks?.id === trackId)
    return trackLessons.length
  }

  // Get estimated total lessons for a track (you might want to get this from your data)
  const getTotalLessons = (trackId: string) => {
    // This is a placeholder - you should replace with actual data
    return 18; // Assuming ~18 lessons per track as in original code
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Learning Paths</h2>
          <p className="text-gray-600 mt-1">Continue your journey through these learning tracks</p>
        </div>
        <Button asChild variant="outline" className="border-[#004AAD] text-[#004AAD] hover:bg-[#004AAD] hover:text-white">
          <Link href="/learn" className="flex items-center">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {tracks.map((track) => {
          const completedLessons = getTrackProgress(track.id)
          const totalLessons = getTotalLessons(track.id)
          const progressPercent = Math.min((completedLessons / totalLessons) * 100, 100)
          const isStarted = completedLessons > 0
          const isCompleted = completedLessons >= totalLessons

          return (
            <Card
              key={track.id}
              className="border-2 border-[#F4F4F9] bg-white shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl ${isCompleted ? 'bg-[#6A0DAD]/10' : 'bg-[#004AAD]/10'} group-hover:scale-105 transition-transform`}>
                    <div className="text-xl">
                      {track.icon || (isCompleted ? '🎯' : '📚')}
                    </div>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl text-gray-800 flex items-center">
                      {track.title}
                      {isCompleted && (
                        <Star className="h-5 w-5 text-[#FF6B00] ml-2 fill-current" />
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{track.description}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">Progress</span>
                    <span className="font-semibold text-[#004AAD]">
                      {completedLessons}/{totalLessons} lessons
                    </span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${isCompleted ? 'bg-[#6A0DAD]' : 'bg-[#004AAD]'}`}
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    {isCompleted && (
                      <div className="absolute -top-1 -right-1">
                        <div className="bg-[#6A0DAD] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          ✓
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {isCompleted ? (
                      <span className="text-[#6A0DAD] font-medium">Course completed!</span>
                    ) : isStarted ? (
                      <span className="text-[#004AAD] font-medium">{Math.round(progressPercent)}% complete</span>
                    ) : (
                      <span>Not started yet</span>
                    )}
                  </div>
                  
                  <Button
                    asChild
                    size="sm"
                    className={`font-semibold ${isCompleted ? 
                      'bg-[#6A0DAD] hover:bg-[#6A0DAD]/90' : 
                      'bg-[#004AAD] hover:bg-[#004AAD]/90'
                    }`}
                  >
                    <Link href={`/learn/${track.id}`} className="flex items-center">
                      {isCompleted ? 'Review' : isStarted ? 'Continue' : 'Start'}
                      <ArrowRight className="ml-1 h-4 w-4" />
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