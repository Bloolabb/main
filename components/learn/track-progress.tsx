// components/learn/track-progress.tsx
'use client'

interface TrackProgressProps {
  track: {
    id: string
    title: string
    description?: string
    modules?: Array<{
      id: string
      title: string
      lessons?: Array<{ id: string }>
      order_index: number
    }>
  }
  userProgress: Array<{
    lesson_id: string
    completed: boolean
    score?: number
  }>
}

export function TrackProgress({ track, userProgress }: TrackProgressProps) {
  // Calculate overall progress
  const totalLessons = track.modules?.flatMap(module => module.lessons || []).length || 0
  const completedLessons = userProgress.filter(progress => progress.completed).length
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  // Calculate module-wise progress
  const moduleProgress = track.modules?.map(module => {
    const moduleLessons = module.lessons || []
    const completedModuleLessons = userProgress.filter(progress => 
      progress.completed && moduleLessons.some(lesson => lesson.id === progress.lesson_id)
    ).length
    
    return {
      ...module,
      completed: completedModuleLessons,
      total: moduleLessons.length,
      percentage: moduleLessons.length > 0 ? Math.round((completedModuleLessons / moduleLessons.length) * 100) : 0
    }
  }) || []

  return (
    <div className="bg-white border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Track Progress</h3>
        <span className="text-sm font-medium text-blue-600">
          {completedLessons} of {totalLessons} lessons completed
        </span>
      </div>

      {/* Overall Progress Bar */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Overall Progress</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-green-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Module-wise Progress */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Module Progress</h4>
        {moduleProgress.map((module) => (
          <div key={module.id} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {module.order_index}. {module.title}
              </span>
              <span className="text-gray-500">
                {module.completed}/{module.total} lessons
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ease-out ${
                  module.percentage === 100 ? 'bg-green-500' : 
                  module.percentage > 0 ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                style={{ width: `${module.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{completedLessons}</div>
          <div className="text-xs text-gray-500">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{totalLessons - completedLessons}</div>
          <div className="text-xs text-gray-500">Remaining</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{progressPercentage}%</div>
          <div className="text-xs text-gray-500">Overall</div>
        </div>
      </div>
    </div>
  )
}