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

    // Get user profile and progress
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    const { data: userProgress } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("completed", true)

    // Get all badges and user's current badges
    const { data: allBadges } = await supabase.from("badges").select("*")

    const { data: userBadges } = await supabase.from("user_badges").select("badge_id").eq("user_id", user.id)

    const earnedBadgeIds = userBadges?.map((ub) => ub.badge_id) || []
    const newBadges: string[] = []

    // Check each badge condition
    for (const badge of allBadges || []) {
      if (earnedBadgeIds.includes(badge.id)) continue

      let shouldEarn = false

      switch (badge.condition_type) {
        case "xp_milestone":
          shouldEarn = (profile?.total_xp || 0) >= badge.condition_value
          break
        case "streak":
          shouldEarn = (profile?.current_streak || 0) >= badge.condition_value
          break
        case "lessons_completed":
          shouldEarn = (userProgress?.length || 0) >= badge.condition_value
          break
        case "track_completed":
          // More complex logic needed for track completion
          break
      }

      if (shouldEarn) {
        const { error } = await supabase.from("user_badges").insert({
          user_id: user.id,
          badge_id: badge.id,
        })

        if (!error) {
          newBadges.push(badge.id)
        }
      }
    }

    return NextResponse.json({ newBadges })
  } catch (error) {
    console.error("Error checking badges:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
