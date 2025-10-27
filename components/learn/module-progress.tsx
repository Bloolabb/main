// components/learn/module-progress.tsx
interface ModuleProgressProps {
  lessons: any[]
  userProgress: any[]
}

export function ModuleProgress({ lessons, userProgress }: ModuleProgressProps) {
  const completedLessons = userProgress.filter(p => p.completed).length
  const totalLessons = lessons.length
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800">Module Progress</h3>
        <span className="text-sm text-gray-600">{progressPercentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-green-600 h-3 rounded-full transition-all duration-300" 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="flex justify-between mt-3 text-sm text-gray-600">
        <span>{completedLessons} of {totalLessons} lessons completed</span>
        <span>{totalLessons - completedLessons} remaining</span>
      </div>
    </div>
  )
}