import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { BadgeGrid } from "@/components/achievements/badge-grid"
import { AchievementStats } from "@/components/achievements/achievement-stats"

export default async function AchievementsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get all badges
  const { data: allBadges } = await supabase.from("badges").select("*").order("condition_value")

  // Get user's earned badges
  const { data: userBadges } = await supabase
    .from("user_badges")
    .select(`
      *,
      badges(*)
    `)
    .eq("user_id", data.user.id)

  // Get user progress for badge calculations
  const { data: userProgress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", data.user.id)
    .eq("completed", true)

  return (
    <DashboardLayout user={data.user} profile={profile}>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-800">Your Achievements</h1>
          <p className="text-lg text-gray-600">Collect badges and celebrate your learning milestones!</p>
        </div>

        <AchievementStats
          profile={profile}
          userBadges={userBadges || []}
          totalBadges={allBadges?.length || 0}
          userProgress={userProgress || []}
        />

        <BadgeGrid
          allBadges={allBadges || []}
          userBadges={userBadges || []}
          profile={profile}
          userProgress={userProgress || []}
          userId={data.user.id}
        />
      </div>
    </DashboardLayout>
  )
}
