import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { UserStats } from "@/components/dashboard/user-stats"
import { LearningTracksOverview } from "@/components/dashboard/learning-tracks-overview"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Rocket, BookOpen, Target, Calendar } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile and stats
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get learning tracks
  const { data: tracks } = await supabase.from("learning_tracks").select("*").order("order_index")

  // Get user progress summary
  const { data: progressData } = await supabase
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
    .eq("completed", true)

  // Calculate some stats for the header
  const completedLessons = progressData?.length || 0
  const totalTracks = tracks?.length || 0

  return (
    <DashboardLayout user={data.user} profile={profile}>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-linear-to-r from-[#6A0DAD] to-[#004AAD] rounded-2xl p-6 text-white shadow-lg">
          <div className="flex flex-col md:flex-row items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold">Welcome back, {profile?.display_name || "Learner"}! 👋</h1>
              <p className="text-white/90 mt-2 max-w-lg">Ready to continue your learning journey today?</p>
              
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <BookOpen className="h-5 w-5 mr-2" />
                  <span>{completedLessons} Completed Lessons</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <Target className="h-5 w-5 mr-2" />
                  <span>{totalTracks} Learning Tracks</span>
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center justify-center bg-white/20 rounded-full h-20 w-20 mt-4 md:mt-0 backdrop-blur-sm">
              <Rocket className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>

        <UserStats profile={profile} />

        <LearningTracksOverview tracks={tracks || []} progressData={progressData || []} />

        <RecentActivity progressData={progressData || []} />
      </div>
    </DashboardLayout>
  )
}