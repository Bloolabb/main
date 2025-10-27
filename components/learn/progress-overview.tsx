// components/learn/progress-overview.tsx
'use client'

interface ProgressOverviewProps {
  tracks: Array<{
    id: string
    title: string
    modules?: Array<{
      lessons?: Array<{ id: string }>
    }>
  }>
  userProgress: Array<{
    lesson_id: string
    completed: boolean
    lessons?: {
      modules?: {
        learning_tracks?: {
          id: string
        }
      }
    }
  }>
}

export function ProgressOverview({ tracks, userProgress }: ProgressOverviewProps) {
  const trackProgress = tracks.map(track => {
    const trackLessons = track.modules?.flatMap(module => module.lessons || []) || []
    const completedTrackLessons = userProgress.filter(progress => 
      progress.completed && 
      progress.lessons?.modules?.learning_tracks?.id === track.id
    ).length
    
    const percentage = trackLessons.length > 0 
      ? Math.round((completedTrackLessons / trackLessons.length) * 100)
      : 0

    return {
      ...track,
      completed: completedTrackLessons,
      total: trackLessons.length,
      percentage
    }
  })

  const overallCompleted = userProgress.filter(p => p.completed).length
  const overallTotal = tracks.flatMap(track => 
    track.modules?.flatMap(module => module.lessons || []) || []
  ).length
  const overallPercentage = overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0

  return (
    <div className="bg-white rounded-xl border p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Learning Overview</h3>
      
      {/* Overall Progress */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700">Total Progress Across All Tracks</span>
          <span className="text-blue-600 font-medium">{overallPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 text-center">
          {overallCompleted} of {overallTotal} lessons completed
        </div>
      </div>

      {/* Individual Track Progress */}
      <div className="space-y-4">
        {trackProgress.map(track => (
          <div key={track.id} className="flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700 truncate">{track.title}</span>
                <span className="text-gray-500 whitespace-nowrap ml-2">
                  {track.completed}/{track.total}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ease-out ${
                    track.percentage === 100 ? 'bg-green-500' :
                    track.percentage >= 50 ? 'bg-blue-500' :
                    track.percentage > 0 ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}
                  style={{ width: `${track.percentage}%` }}
                />
              </div>
            </div>
            <div className="text-xs font-medium text-gray-500 w-10 text-right">
              {track.percentage}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}