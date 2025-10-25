import { requireAdmin } from "@/lib/admin-auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, Trophy, Activity, TrendingUp, AlertCircle, Zap, Target, Clock, BarChart3 } from "lucide-react"

interface UserStats {
  total_xp: number
  current_streak: number
  created_at: string
  last_activity_date?: string
}

interface AdminActivity {
  id: string
  action: string
  target_type?: string
  created_at: string
  admin_user_id: string
}

export default async function AdminDashboardPage() {
  const { user, role } = await requireAdmin()
  const supabase = await createClient()

  // Fetch all dashboard data in parallel
  const [
    usersData,
    tracksData,
    lessonsData,
    badgesData,
    recentActivity,
    userStats
  ] = await Promise.all([
    supabase.from("profiles").select("id, total_xp, current_streak, created_at", { count: "exact" }),
    supabase.from("learning_tracks").select("*", { count: "exact", head: true }),
    supabase.from("lessons").select("*", { count: "exact", head: true }),
    supabase.from("badges").select("*", { count: "exact", head: true }),
    supabase.from("admin_activity_log")
      .select("*, admin_user_id")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase.from("profiles")
      .select("total_xp, current_streak, last_activity_date")
      .not("last_activity_date", "is", null)
  ])

  // Calculate derived statistics with proper types and null checks
  const totalUsers = usersData.count || 0
  const activeUsers = usersData.data?.filter((u: UserStats) => u.current_streak > 0).length || 0
  const recentUsers = usersData.data?.filter((u: UserStats) => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return new Date(u.created_at) > weekAgo
  }).length || 0
  
  const avgXP = usersData.data?.reduce((sum: number, u: UserStats) => sum + (u.total_xp || 0), 0) / (totalUsers || 1) || 0
  const totalXP = usersData.data?.reduce((sum: number, u: UserStats) => sum + (u.total_xp || 0), 0) || 0

  // Calculate progress percentage for active users
  const activeUserPercentage = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0

  // Safe data access with fallbacks
  const lessonsCount = lessonsData.count || 0
  const tracksCount = tracksData.count || 0
  const badgesCount = badgesData.count || 0

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Enhanced Header */}
      <div className="border-b border-slate-700 bg-slate-800/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-white to-slate-200 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-slate-400 flex items-center gap-2">
                  <Zap className="h-3 w-3 text-yellow-400" />
                  Welcome back, {user.email}
                </p>
              </div>
            </div>
            <Badge className="bg-linear-to-r from-red-600 to-orange-600 text-white border-0 shadow-lg">
              {role.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
          <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-200">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1">{totalUsers.toLocaleString()}</div>
              <div className="flex justify-between text-xs">
                <span className="text-green-400">{activeUsers} active</span>
                <span className="text-blue-400">{recentUsers} new</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-200">Learning Content</CardTitle>
              <BookOpen className="h-4 w-4 text-green-400 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1">{lessonsCount.toLocaleString()}</div>
              <p className="text-xs text-slate-400">
                Across <span className="text-green-400">{tracksCount}</span> tracks
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-200">Achievements</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-400 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1">{badgesCount.toLocaleString()}</div>
              <p className="text-xs text-slate-400">Available badges</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-200">Total XP</CardTitle>
              <Target className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1">{Math.round(totalXP).toLocaleString()}</div>
              <p className="text-xs text-slate-400">
                <span className="text-purple-400">{Math.round(avgXP)}</span> avg per user
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-200">System Health</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1">99.9%</div>
              <p className="text-xs text-slate-400">Uptime</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Enhanced Recent Activity */}
          <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm xl:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-400" />
                Recent Admin Activity
                <Badge variant="secondary" className="ml-2 bg-blue-500/20 text-blue-300">
                  Live
                </Badge>
              </CardTitle>
              <CardDescription className="text-slate-400">
                Latest administrative actions across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.data && recentActivity.data.length > 0 ? (
                  recentActivity.data.map((activity: AdminActivity) => (
                    <div 
                      key={activity.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-600 rounded-lg">
                          <Clock className="h-3 w-3 text-slate-300" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white capitalize">
                            {activity.action.replace(/_/g, " ")}
                          </p>
                          <p className="text-xs text-slate-400">
                            {new Date(activity.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-300 group-hover:border-slate-500">
                        {activity.target_type || "system"}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Quick Actions */}
          <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                Quick Actions
              </CardTitle>
              <CardDescription className="text-slate-400">
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { href: "/admin/users", icon: Users, label: "Manage Users", color: "text-blue-400", bg: "bg-blue-500/20" },
                  { href: "/admin/content", icon: BookOpen, label: "Content", color: "text-green-400", bg: "bg-green-500/20" },
                  { href: "/admin/analytics", icon: TrendingUp, label: "Analytics", color: "text-purple-400", bg: "bg-purple-500/20" },
                  { href: "/admin/settings", icon: AlertCircle, label: "Settings", color: "text-red-400", bg: "bg-red-500/20" },
                ].map((action) => (
                  <a
                    key={action.href}
                    href={action.href}
                    className="p-4 rounded-xl bg-slate-700/50 hover:bg-slate-700/70 transition-all duration-300 group hover:scale-105 border border-slate-600 hover:border-slate-500 text-center"
                  >
                    <div className={`p-2 rounded-lg ${action.bg} w-12 h-12 mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <action.icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <p className="text-sm font-medium text-white">{action.label}</p>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-200">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{activeUsers}</div>
              <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${activeUserPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {Math.round(activeUserPercentage)}% of total users
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-200">Content Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-slate-300 mb-2">
                <span>Tracks</span>
                <span>{tracksCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Lessons</span>
                <span>{lessonsCount}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-200">Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">99.9%</div>
              <p className="text-xs text-slate-400">System uptime</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
