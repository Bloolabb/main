import { requireAdmin } from "@/lib/admin-auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, BookOpen, Calendar, Activity } from "lucide-react"

export default async function AdminAnalyticsPage() {
  await requireAdmin()
  const supabase = await createClient()

  // Fetch analytics data
  const [{ data: userGrowth }, { data: completionStats }, { data: popularTracks }, { data: recentActivity }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      supabase.from("user_progress").select("completed, lesson_id, created_at").eq("completed", true),
      supabase.from("learning_tracks").select("title, color, icon"),
      supabase
        .from("admin_activity_log")
        .select("action, created_at, details")
        .order("created_at", { ascending: false })
        .limit(10),
    ])

  const dailySignups = userGrowth?.reduce(
    (acc, user) => {
      const date = new Date(user.created_at).toDateString()
      acc[date] = (acc[date] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const completionRate = completionStats?.length || 0
  const avgCompletionsPerDay = Math.round(completionRate / 30)

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-purple-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
              <p className="text-slate-400">Platform performance and user insights</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">New Users (30d)</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userGrowth?.length || 0}</div>
              <p className="text-xs text-slate-400">
                <span className="text-green-400">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Lesson Completions</CardTitle>
              <BookOpen className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{completionRate}</div>
              <p className="text-xs text-slate-400">
                <span className="text-green-400">{avgCompletionsPerDay}</span> per day avg
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Engagement Rate</CardTitle>
              <Activity className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">78%</div>
              <p className="text-xs text-slate-400">
                <span className="text-green-400">+5%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Avg Session</CardTitle>
              <Calendar className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">24m</div>
              <p className="text-xs text-slate-400">
                <span className="text-green-400">+3m</span> from last week
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Popular Learning Tracks */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Popular Learning Tracks</CardTitle>
              <CardDescription className="text-slate-400">Most engaged content areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularTracks?.map((track, index) => (
                  <div key={track.title} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                        style={{ backgroundColor: track.color }}
                      >
                        {track.icon}
                      </div>
                      <span className="text-white">{track.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-400 h-2 rounded-full"
                          style={{ width: `${Math.max(20, 100 - index * 20)}%` }}
                        />
                      </div>
                      <span className="text-slate-400 text-sm">{Math.max(20, 100 - index * 20)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Admin Activity */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Admin Activity</CardTitle>
              <CardDescription className="text-slate-400">Latest administrative actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity?.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-slate-700">
                    <div>
                      <p className="text-sm text-white">{activity.action.replace("_", " ")}</p>
                      <p className="text-xs text-slate-400">{new Date(activity.created_at).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                      {activity.details?.role || "system"}
                    </Badge>
                  </div>
                )) || <p className="text-slate-400 text-sm">No recent activity</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
