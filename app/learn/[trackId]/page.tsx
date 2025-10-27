// app/learn/[trackId]/page.tsx - UPGRADED
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ModuleCard } from "@/components/learn/module-card"
import { TrackHeader } from "@/components/learn/track-header"
import { TrackProgress } from "@/components/learn/track-progress"

export default async function TrackPage({ params }: { params: Promise<{ trackId: string }> }) {
  const { trackId } = await params
  const supabase = await createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) redirect("/auth/login")

    const [profileData, trackData, progressData, nextLessonData] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("learning_tracks").select(`*, modules(*, lessons(*))`).eq("id", trackId).single(),
      supabase.from("user_progress").select(`*, lessons!inner(*, modules!inner(*))`).eq("user_id", user.id).eq("lessons.modules.track_id", trackId),
      // Get next recommended lesson
      supabase.rpc('get_next_recommended_lesson', { user_id: user.id, track_id: trackId })
    ])

    if (trackData.error || !trackData.data) redirect("/learn")

    const sortedModules = trackData.data.modules?.sort((a, b) => a.order_index - b.order_index) || []
    const userProgress = progressData.data || []

    return (
      <DashboardLayout user={user} profile={profileData.data}>
        <div className="space-y-8 p-6">
          {/* Track Header with Progress */}
          <TrackHeader 
            track={trackData.data} 
            userProgress={userProgress} 
            nextLesson={nextLessonData.data}
          />


          {/* Modules Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Course Modules</h2>
              <div className="text-sm text-gray-500">
                {sortedModules.filter(m => (profileData.data?.total_xp || 0) >= (m.unlock_xp_required || 0)).length} of {sortedModules.length} unlocked
              </div>
            </div>

            <div className="space-y-4">
              {sortedModules.map((module, index) => (
                <ModuleCard 
                  key={module.id} 
                  module={module} 
                  trackId={trackId} 
                  isUnlocked={(profileData.data?.total_xp || 0) >= (module.unlock_xp_required || 0)}
                  userProgress={userProgress?.filter(p => p.lessons?.module_id === module.id) || []}
                  moduleIndex={index}
                  isFirst={index === 0}
                  isLast={index === sortedModules.length - 1}
                />
              ))}
            </div>
          </div> 
        </div>         
        {/* Overall Track Progress */}
          <TrackProgress 
            track={trackData.data}
            userProgress={userProgress}
          />

      </DashboardLayout>
    )
  } catch (error) {
    console.error("Track page error:", error)
    redirect("/learn")
  }
}