import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ModuleCard } from "@/components/learn/module-card"
import { TrackHeader } from "@/components/learn/track-header"

export default async function TrackPage({ params }: { params: Promise<{ trackId: string }> }) {
  const { trackId } = await params
  const supabase = await createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) redirect("/auth/login")

    const [profileData, trackData, progressData] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("learning_tracks").select(`*, modules(*, lessons(*))`).eq("id", trackId).single(),
      supabase.from("user_progress").select(`*, lessons!inner(*, modules!inner(*))`).eq("user_id", user.id).eq("lessons.modules.track_id", trackId)
    ])

    // Early return for track not found
    if (trackData.error || !trackData.data) redirect("/learn")

    const sortedModules = trackData.data.modules?.sort((a, b) => a.order_index - b.order_index) || []

    return (
      <DashboardLayout user={user} profile={profileData.data}>
        <div className="space-y-4">
          <TrackHeader track={trackData.data} userProgress={progressData.data || []} />
          <h2 className="text-xl font-bold text-gray-800 mb-3">Learning Modules</h2>
          <div className="space-y-3">
            {sortedModules.map((module, index) => (
              <ModuleCard 
                key={module.id} 
                module={module} 
                trackId={trackId} 
                isUnlocked={(profileData.data?.total_xp || 0) >= (module.unlock_xp_required || 0)}
                userProgress={progressData.data?.filter(p => p.lessons?.module_id === module.id) || []}
                moduleIndex={index} 
              />
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  } catch (error) {
    console.error("Track page error:", error)
    redirect("/learn")
  }
}
