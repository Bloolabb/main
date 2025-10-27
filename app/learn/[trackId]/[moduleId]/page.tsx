import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { LessonCard } from "@/components/learn/lesson-card"
import { ModuleHeader } from "@/components/learn/module-header"
import Link from "next/link"

export default async function ModulePage({ params }: { params: Promise<{ trackId: string; moduleId: string }> }) {
  const { trackId, moduleId } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // First, fetch module data to get lesson IDs
  const moduleData = await supabase
    .from("modules")
    .select(`*, learning_tracks(*), lessons(*)`)
    .eq("id", moduleId)
    .eq("track_id", trackId)
    .single()

  if (!moduleData.data) {
    redirect("/learn")
  }

  const lessonIds = moduleData.data.lessons?.map((l: any) => l.id) || []

  // Then fetch other data in parallel
  const [profileData, progressData, trackData, allModulesData] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", data.user.id).single(),
    supabase.from("user_progress").select("*").eq("user_id", data.user.id).in("lesson_id", lessonIds),
    supabase.from("learning_tracks").select("*").eq("id", trackId).single(),
    supabase.from("modules").select("id, order_index").eq("track_id", trackId).order("order_index")
  ])

  const module = moduleData.data
  const userProgress = progressData.data || []
  const sortedLessons = module.lessons?.sort((a: any, b: any) => a.order_index - b.order_index) || []
  const allModules = allModulesData.data || []

  // Calculate progress for the progress section
  const completedLessons = userProgress.filter(p => p.completed).length
  const totalLessons = sortedLessons.length
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  // Find previous and next modules
  const currentModuleIndex = allModules.findIndex(m => m.id === moduleId)
  const previousModule = currentModuleIndex > 0 ? allModules[currentModuleIndex - 1] : null
  const nextModule = currentModuleIndex < allModules.length - 1 ? allModules[currentModuleIndex + 1] : null

  return (
    <DashboardLayout user={data.user} profile={profileData.data}>
      <div className="space-y-8 p-6">
        {/* Module Header */}
        <ModuleHeader 
          module={module} 
          userProgress={userProgress} 
        />

        {/* Progress Section - Replacing ModuleProgress */}
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

        {/* Lessons Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Lessons</h2>
            <div className="text-sm text-gray-500">
              {completedLessons} of {totalLessons} completed
            </div>
          </div>

          <div className="grid gap-4">
            {sortedLessons.map((lesson: any, index: number) => {
              const lessonProgress = userProgress?.find((p) => p.lesson_id === lesson.id)
              const isUnlocked = index === 0 || userProgress?.some((p) =>
                module.lessons?.find((l: any, i: number) => l.id === p.lesson_id && i < index && p.completed)
              )

              return (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  trackId={trackId}
                  moduleId={moduleId}
                  isCompleted={lessonProgress?.completed || false}
                  isUnlocked={isUnlocked}
                  score={lessonProgress?.score}
                  orderIndex={index + 1}
                  estimatedMinutes={lesson.estimated_minutes}
                />
              )
            })}
          </div>
        </div>
        
        {/* Fixed Module Navigation */}
        <div className="flex justify-between pt-8 border-t">
          {previousModule ? (
            <Link 
              href={`/learn/${trackId}/${previousModule.id}`}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              ← Previous Module
            </Link>
          ) : (
            <div className="px-6 py-3 border border-gray-200 text-gray-400 rounded-lg flex items-center gap-2 cursor-not-allowed">
              ← Previous Module
            </div>
          )}
          
          {nextModule ? (
            <Link 
              href={`/learn/${trackId}/${nextModule.id}`}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              Next Module →
            </Link>
          ) : (
            <div className="px-6 py-3 bg-gray-400 text-white rounded-lg flex items-center gap-2 cursor-not-allowed">
              Next Module →
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}