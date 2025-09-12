import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { lessonId, score, completed, answers } = body

    // Update or create user progress
    const { error: progressError } = await supabase.from("user_progress").upsert({
      user_id: user.id,
      lesson_id: lessonId,
      completed,
      score,
      attempts: 1, // This should be incremented properly
      completed_at: completed ? new Date().toISOString() : null,
    })

    if (progressError) {
      return NextResponse.json({ error: progressError.message }, { status: 500 })
    }

    // If lesson completed, update user profile
    if (completed) {
      const { data: lesson } = await supabase.from("lessons").select("xp_reward").eq("id", lessonId).single()

      if (lesson) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (profile) {
          const newXP = profile.total_xp + lesson.xp_reward
          const today = new Date().toISOString().split("T")[0]
          const lastActivity = profile.last_activity_date

          let newStreak = profile.current_streak
          if (lastActivity) {
            const lastDate = new Date(lastActivity)
            const todayDate = new Date(today)
            const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

            if (diffDays === 1) {
              newStreak += 1
            } else if (diffDays > 1) {
              newStreak = 1
            }
          } else {
            newStreak = 1
          }

          await supabase
            .from("profiles")
            .update({
              total_xp: newXP,
              current_streak: newStreak,
              longest_streak: Math.max(newStreak, profile.longest_streak || 0),
              last_activity_date: today,
              updated_at: new Date().toISOString(),
            })
            .eq("id", user.id)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error submitting exercises:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
