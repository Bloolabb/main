import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ModuleCard } from "@/components/learn/module-card"
import { TrackHeader } from "@/components/learn/track-header"

export default async function TrackPage({ params }: { params: Promise<{ trackId: string }> }) {
  const { trackId } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get track with modules and lessons
  const { data: track } = await supabase
    .from("learning_tracks")
    .select(`
      *,
      modules(
        *,
        lessons(*)
      )
    `)
    .eq("id", trackId)
    .single()

  if (!track) {
    redirect("/learn")
  }

  // Get user progress for this track
  const { data: userProgress } = await supabase
    .from("user_progress")
    .select(`
      *,
      lessons!inner(
        *,
        modules!inner(*)
      )
    `)
    .eq("user_id", data.user.id)
    .eq("lessons.modules.track_id", trackId)

  return (
    <DashboardLayout user={data.user} profile={profile}>
      <div className="space-y-6">
        <TrackHeader track={track} userProgress={userProgress || []} />

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Learning Modules</h2>
          <div className="grid gap-6">
            {track.modules
              ?.sort((a, b) => a.order_index - b.order_index)
              .map((module, index) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  trackId={trackId}
                  isUnlocked={profile?.total_xp >= module.unlock_xp_required}
                  userProgress={userProgress?.filter((p) => p.lessons?.module_id === module.id) || []}
                  moduleIndex={index}
                />
              ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
