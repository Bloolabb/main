// app/learn/[trackId]/[moduleId]/page.tsx - UPGRADED
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { LessonCard } from "@/components/learn/lesson-card"
import { ModuleHeader } from "@/components/learn/module-header"
import { ModuleProgress } from "@/components/learn/module-progress"

export default async function ModulePage({ params }: { params: Promise<{ trackId: string; moduleId: string }> }) {
  const { trackId, moduleId } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Parallel data fetching
  const [profileData, moduleData, progressData, trackData] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", data.user.id).single(),
    supabase.from("modules").select(`*, learning_tracks(*), lessons(*)`).eq("id", moduleId).eq("track_id", trackId).single(),
    supabase.from("user_progress").select("*").eq("user_id", data.user.id).in("lesson_id", moduleData.data?.lessons?.map((l: any) => l.id) || []),
    supabase.from("learning_tracks").select("*").eq("id", trackId).single()
  ])

  if (!moduleData.data) {
    redirect("/learn")
  }

  const module = moduleData.data
  const userProgress = progressData.data || []
  const sortedLessons = module.lessons?.sort((a: any, b: any) => a.order_index - b.order_index) || []

  return (
    <DashboardLayout user={data.user} profile={profileData.data}>
      <div className="space-y-8">
        {/* Module Header */}
        <ModuleHeader 
          module={module} 
          userProgress={userProgress} 
          track={trackData.data}
        />

        {/* Module Progress */}
        <ModuleProgress 
          lessons={sortedLessons}
          userProgress={userProgress}
        />

        {/* Lessons Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Lessons</h2>
            <div className="text-sm text-gray-500">
              {userProgress.filter(p => p.completed).length} of {sortedLessons.length} completed
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
                  isCurrent={!lessonProgress?.completed && isUnlocked}
                  score={lessonProgress?.score}
                  orderIndex={index + 1}
                  estimatedMinutes={lesson.estimated_minutes}
                />
              )
            })}
          </div>
        </div>

        {/* Module Navigation */}
        <div className="flex justify-between pt-8 border-t">
          <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            ← Previous Module
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            Next Module →
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}