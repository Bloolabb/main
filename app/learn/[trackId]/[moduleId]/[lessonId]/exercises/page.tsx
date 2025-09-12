import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ExerciseEngine } from "@/components/exercises/exercise-engine"

export default async function ExercisesPage({
  params,
}: {
  params: Promise<{ trackId: string; moduleId: string; lessonId: string }>
}) {
  const { trackId, moduleId, lessonId } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get lesson with exercises
  const { data: lesson } = await supabase
    .from("lessons")
    .select(`
      *,
      modules!inner(
        *,
        learning_tracks!inner(*)
      ),
      exercises(*)
    `)
    .eq("id", lessonId)
    .eq("modules.id", moduleId)
    .eq("modules.track_id", trackId)
    .single()

  if (!lesson) {
    redirect("/learn")
  }

  // Get user progress for this lesson
  const { data: userProgress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", data.user.id)
    .eq("lesson_id", lessonId)
    .single()

  // Get all lessons in this module for navigation
  const { data: allLessons } = await supabase
    .from("lessons")
    .select("id, title, order_index")
    .eq("module_id", moduleId)
    .order("order_index")

  return (
    <DashboardLayout user={data.user} profile={profile}>
      <ExerciseEngine
        lesson={lesson}
        exercises={lesson.exercises?.sort((a, b) => a.order_index - b.order_index) || []}
        userProgress={userProgress}
        allLessons={allLessons || []}
        trackId={trackId}
        moduleId={moduleId}
        userId={data.user.id}
      />
    </DashboardLayout>
  )
}
