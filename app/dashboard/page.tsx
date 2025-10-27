import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { UserStats } from "@/components/dashboard/user-stats"
import { LearningTracksOverview } from "@/components/dashboard/learning-tracks-overview"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Rocket, BookOpen, Target, Calendar, Sparkles, Zap, TrendingUp } from "lucide-react"

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
  const userLevel = profile?.total_xp ? Math.floor(profile.total_xp / 100) + 1 : 1

  return (
    <DashboardLayout user={data.user} profile={profile}>
      <div className="space-y-8 p-6">
        {/* Magical Header Section */}
        <div className="relative overflow-hidden bg-linear-to-br from-gray-900 via-purple-900 to-blue-900 rounded-3xl p-8 text-white shadow-2xl">
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full -translate-x-24 translate-y-24"></div>
          
          {/* Floating sparkles */}
          <div className="absolute top-6 right-6 opacity-60">
            <Sparkles className="h-8 w-8 text-amber-300 animate-pulse" />
          </div>
          <div className="absolute bottom-6 left-6 opacity-40">
            <Zap className="h-6 w-6 text-blue-300 animate-pulse delay-700" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                    <Sparkles className="h-6 w-6 text-amber-300" />
                  </div>
                  <h1 className="text-4xl font-bold bg-linear-to-r from-white to-amber-200 bg-clip-text text-transparent">
                    Welcome back, {profile?.display_name || "Learner"}! ✨
                  </h1>
                </div>
                
                <p className="text-white/80 text-lg max-w-2xl leading-relaxed">
                  Your learning journey is looking magical today! Ready to unlock new achievements?
                </p>
                
                {/* Stats Cards */}
                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                    <div className="p-2 bg-green-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="h-5 w-5 text-green-300" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{completedLessons}</div>
                      <div className="text-white/70 text-sm">Completed Lessons</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                    <div className="p-2 bg-blue-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Target className="h-5 w-5 text-blue-300" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{totalTracks}</div>
                      <div className="text-white/70 text-sm">Learning Tracks</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                    <div className="p-2 bg-amber-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="h-5 w-5 text-amber-300" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">Level {userLevel}</div>
                      <div className="text-white/70 text-sm">Current Level</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Rocket Illustration */}
              <div className="hidden lg:flex items-center justify-center relative">
                <div className="relative">
                  <div className="w-24 h-24 bg-linear-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl rotate-12 group hover:rotate-0 transition-transform duration-500">
                    <Rocket className="h-12 w-12 text-white transform -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                  </div>
                  {/* Rocket trail */}
                  <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-linear-to-r from-orange-500 to-red-500 rounded-full blur-sm opacity-60 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Daily Motivation */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="flex items-center gap-3 text-amber-200">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <p className="text-sm font-medium">
                  {completedLessons > 0 
                    ? `You're on a roll! ${completedLessons} lessons conquered and counting.` 
                    : "Every expert was once a beginner. Start your first lesson today!"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Stats with Sparkle Magic */}
        <UserStats profile={profile} />

        {/* Learning Tracks Overview */}
        <LearningTracksOverview tracks={tracks || []} progressData={progressData || []} />

        {/* Recent Activity */}
        <RecentActivity progressData={progressData || []} />

      </div>
    </DashboardLayout>
  )
}