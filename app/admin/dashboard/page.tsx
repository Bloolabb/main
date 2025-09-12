import { requireAdmin } from "@/lib/admin-auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, Trophy, Activity, TrendingUp, AlertCircle } from "lucide-react"

export default async function AdminDashboardPage() {
  const { user, role } = await requireAdmin()
  const supabase = await createClient()

  // Fetch dashboard statistics
  const [
    { count: totalUsers },
    { count: totalTracks },
    { count: totalLessons },
    { count: totalBadges },
    { data: recentActivity },
    { data: userStats },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("learning_tracks").select("*", { count: "exact", head: true }),
    supabase.from("lessons").select("*", { count: "exact", head: true }),
    supabase.from("badges").select("*", { count: "exact", head: true }),
    supabase.from("admin_activity_log").select("*, admin_user_id").order("created_at", { ascending: false }).limit(5),
    supabase.from("profiles").select("total_xp, current_streak, created_at").order("created_at", { ascending: false }),
  ])

  const activeUsers = userStats?.filter((u) => u.current_streak > 0).length || 0
  const avgXP = userStats?.reduce((sum, u) => sum + (u.total_xp || 0), 0) / (userStats?.length || 1) || 0

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-slate-400">Welcome back, {user.email}</p>
            </div>
            <Badge variant="secondary" className="bg-red-600 text-white">
              {role.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalUsers || 0}</div>
              <p className="text-xs text-slate-400">
                <span className="text-green-400">{activeUsers}</span> active this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Learning Content</CardTitle>
              <BookOpen className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalLessons || 0}</div>
              <p className="text-xs text-slate-400">
                Across <span className="text-green-400">{totalTracks || 0}</span> tracks
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Achievements</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalBadges || 0}</div>
              <p className="text-xs text-slate-400">Available badges</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Avg XP</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{Math.round(avgXP)}</div>
              <p className="text-xs text-slate-400">Per user</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Admin Activity
              </CardTitle>
              <CardDescription className="text-slate-400">Latest administrative actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity?.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-2 border-b border-slate-700">
                    <div>
                      <p className="text-sm text-white">{activity.action.replace("_", " ")}</p>
                      <p className="text-xs text-slate-400">{new Date(activity.created_at).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                      {activity.target_type || "system"}
                    </Badge>
                  </div>
                )) || <p className="text-slate-400 text-sm">No recent activity</p>}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-slate-400">Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="/admin/users"
                  className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-center"
                >
                  <Users className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-white">Manage Users</p>
                </a>
                <a
                  href="/admin/content"
                  className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-center"
                >
                  <BookOpen className="h-6 w-6 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-white">Content</p>
                </a>
                <a
                  href="/admin/analytics"
                  className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-center"
                >
                  <TrendingUp className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-sm text-white">Analytics</p>
                </a>
                <a
                  href="/admin/settings"
                  className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-center"
                >
                  <AlertCircle className="h-6 w-6 text-red-400 mx-auto mb-2" />
                  <p className="text-sm text-white">Settings</p>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
