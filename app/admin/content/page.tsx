import { requireAdmin } from "@/lib/admin-auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Plus, Edit, Trash2, Eye } from "lucide-react"

export default async function AdminContentPage() {
  await requireAdmin()
  const supabase = await createClient()

  // Fetch learning tracks with module and lesson counts
  const { data: tracks } = await supabase
    .from("learning_tracks")
    .select(`
      *,
      modules(
        id,
        title,
        lessons(id, title)
      )
    `)
    .order("order_index")

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-green-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Content Management</h1>
                <p className="text-slate-400">Manage learning tracks, modules, and lessons</p>
              </div>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Content
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Content Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Learning Tracks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{tracks?.length || 0}</div>
              <p className="text-slate-400 text-sm">Active learning paths</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">
                {tracks?.reduce((sum, track) => sum + (track.modules?.length || 0), 0) || 0}
              </div>
              <p className="text-slate-400 text-sm">Learning modules</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">
                {tracks?.reduce(
                  (sum, track) =>
                    sum + (track.modules?.reduce((modSum, mod) => modSum + (mod.lessons?.length || 0), 0) || 0),
                  0,
                ) || 0}
              </div>
              <p className="text-slate-400 text-sm">Individual lessons</p>
            </CardContent>
          </Card>
        </div>

        {/* Learning Tracks */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Learning Tracks</CardTitle>
            <CardDescription className="text-slate-400">Manage your educational content structure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tracks?.map((track) => (
                <div
                  key={track.id}
                  className="p-6 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                        style={{ backgroundColor: track.color }}
                      >
                        {track.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{track.title}</h3>
                        <p className="text-slate-400 mb-4">{track.description}</p>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="border-blue-600 text-blue-400">
                            {track.modules?.length || 0} modules
                          </Badge>
                          <Badge variant="outline" className="border-purple-600 text-purple-400">
                            {track.modules?.reduce((sum, mod) => sum + (mod.lessons?.length || 0), 0) || 0} lessons
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )) || <p className="text-slate-400 text-center py-8">No learning tracks found</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
