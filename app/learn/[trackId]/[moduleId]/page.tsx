import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { LessonCard } from "@/components/learn/lesson-card"
import { ModuleHeader } from "@/components/learn/module-header"

export default async function ModulePage({ params }: { params: Promise<{ trackId: string; moduleId: string }> }) {
  const { trackId, moduleId } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get module with lessons and track info
  const { data: module } = await supabase
    .from("modules")
    .select(`
      *,
      learning_tracks(*),
      lessons(*)
    `)
    .eq("id", moduleId)
    .eq("track_id", trackId)
    .single()

  if (!module) {
    redirect("/learn")
  }

  // Get user progress for this module
  const { data: userProgress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", data.user.id)
    .in("lesson_id", module.lessons?.map((l) => l.id) || [])

  return (
    <DashboardLayout user={data.user} profile={profile}>
      <div className="space-y-6">
        <ModuleHeader module={module} userProgress={userProgress || []} />

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Lessons</h2>
          <div className="grid gap-4">
            {module.lessons
              ?.sort((a, b) => a.order_index - b.order_index)
              .map((lesson, index) => {
                const lessonProgress = userProgress?.find((p) => p.lesson_id === lesson.id)
                const isUnlocked =
                  index === 0 ||
                  userProgress?.some((p) =>
                    module.lessons?.find((l, i) => l.id === p.lesson_id && i < index && p.completed),
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
                  />
                )
              })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
