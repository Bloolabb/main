// app/learn/page.tsx - UPGRADED
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { LearningTrackCard } from "@/components/learn/learning-track-card"
import { ProgressOverview } from "@/components/learn/progress-overview"
import { QuickStats } from "@/components/learn/quick-stats"

export default async function LearnPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Parallel data fetching for better performance
  const [profileData, tracksData, progressData, achievementsData] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", data.user.id).single(),
    supabase.from("learning_tracks").select(`*, modules(*, lessons(*))`).order("order_index"),
    supabase.from("user_progress").select(`*, lessons!inner(*, modules!inner(*, learning_tracks!inner(*)))`).eq("user_id", data.user.id),
    supabase.from("user_achievements").select("*, achievements(*)").eq("user_id", data.user.id)
  ])

  const profile = profileData.data
  const tracks = tracksData.data || []
  const userProgress = progressData.data || []
  const achievements = achievementsData.data || []

  return (
    <DashboardLayout user={data.user} profile={profile}>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Continue Your Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Master AI and Entrepreneurship with hands-on projects and real-world skills
          </p>
        </div>

        {/* Quick Stats */}
        <QuickStats 
          userProgress={userProgress}
          profile={profile}
          achievements={achievements}
        />

        {/* Progress Overview */}
        <ProgressOverview 
          tracks={tracks}
          userProgress={userProgress}
        />

        {/* Learning Tracks Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Available Tracks</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                Sort by: Progress
              </button>
              <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                Filter
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {tracks.map((track) => (
              <LearningTrackCard
                key={track.id}
                track={track}
                userProgress={userProgress.filter((p) => p.lessons?.modules?.learning_tracks?.id === track.id)}
                profile={profile}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {userProgress.slice(0, 5).map((progress) => (
              <div key={progress.id} className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">
                  Completed <strong>{progress.lessons?.title}</strong>
                </span>
                <span className="text-gray-400 ml-auto">
                  {new Date(progress.updated_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}