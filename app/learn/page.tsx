import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { LearningTrackCard } from "@/components/learn/learning-track-card"

export default async function LearnPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get learning tracks with modules
  const { data: tracks } = await supabase
    .from("learning_tracks")
    .select(`
      *,
      modules(
        *,
        lessons(*)
      )
    `)
    .order("order_index")

  // Get user progress
  const { data: userProgress } = await supabase
    .from("user_progress")
    .select(`
      *,
      lessons!inner(
        *,
        modules!inner(
          *,
          learning_tracks!inner(*)
        )
      )
    `)
    .eq("user_id", data.user.id)

  return (
    <DashboardLayout user={data.user} profile={profile}>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-800">Choose Your Learning Path</h1>
          <p className="text-lg text-gray-600">Master AI and Entrepreneurship with interactive lessons</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tracks?.map((track) => (
            <LearningTrackCard
              key={track.id}
              track={track}
              userProgress={userProgress?.filter((p) => p.lessons?.modules?.learning_tracks?.id === track.id) || []}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
