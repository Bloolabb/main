import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AITutors } from "@/components/ai-tutor/ai-tutor"
import { redirect } from "next/navigation"

export default async function AITutorPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  return (
    <DashboardLayout user={data.user} profile={profile}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">AI Tutor Buddy</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn with real AI! 5 free questions daily with our heart system 💖
          </p>
        </div>
        <AITutors />
      </div>
    </DashboardLayout>
  )
}