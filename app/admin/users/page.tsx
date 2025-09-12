import { requireAdmin } from "@/lib/admin-auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Search, MoreHorizontal } from "lucide-react"

export default async function AdminUsersPage() {
  await requireAdmin()
  const supabase = await createClient()

  // Fetch users with their profiles
  const { data: users } = await supabase
    .from("profiles")
    .select(
      `
      *,
      user_badges(count),
      user_progress(count)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">User Management</h1>
                <p className="text-slate-400">Manage platform users and their accounts</p>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">Add User</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search users by name or email..."
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <Button variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">All Users</CardTitle>
            <CardDescription className="text-slate-400">
              {users?.length || 0} users registered on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users?.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user.display_name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.display_name || "Unnamed User"}</p>
                      <p className="text-slate-400 text-sm">ID: {user.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-white font-semibold">{user.total_xp || 0}</p>
                      <p className="text-slate-400 text-xs">XP</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold">{user.current_streak || 0}</p>
                      <p className="text-slate-400 text-xs">Streak</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold">{user.user_badges?.[0]?.count || 0}</p>
                      <p className="text-slate-400 text-xs">Badges</p>
                    </div>
                    <Badge variant="outline" className="border-green-600 text-green-400">
                      Active
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )) || <p className="text-slate-400 text-center py-8">No users found</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
