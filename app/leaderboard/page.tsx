import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { LeaderboardTabs } from "@/components/leaderboard/leaderboard-tabs"

export default async function LeaderboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get top users by XP
  const { data: xpLeaderboard } = await supabase
    .from("profiles")
    .select("id, display_name, total_xp, current_streak")
    .order("total_xp", { ascending: false })
    .limit(50)

  // Get top users by streak
  const { data: streakLeaderboard } = await supabase
    .from("profiles")
    .select("id, display_name, total_xp, current_streak, longest_streak")
    .order("current_streak", { ascending: false })
    .limit(50)

  // Get weekly XP leaders (users who gained XP in the last 7 days)
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const { data: weeklyLeaderboard } = await supabase
    .from("profiles")
    .select("id, display_name, total_xp, current_streak, last_activity_date")
    .gte("last_activity_date", weekAgo.toISOString().split("T")[0])
    .order("total_xp", { ascending: false })
    .limit(50)

  return (
    <DashboardLayout user={data.user} profile={profile}>
      <div className="space-y-8 p-6">

        <LeaderboardTabs
          currentUser={profile}
          xpLeaderboard={xpLeaderboard || []}
          streakLeaderboard={streakLeaderboard || []}
          weeklyLeaderboard={weeklyLeaderboard || []}
        />
      </div>
    </DashboardLayout>
  )
}
