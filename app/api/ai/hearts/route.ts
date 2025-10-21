import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const today = new Date().toISOString().split('T')[0]
    
    try {
      const { data: usage, error } = await supabase
        .from('user_ai_usage')
        .select('hearts_remaining, total_questions_asked')
        .eq('user_id', user.id)
        .eq('hearts_reset_date', today)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Hearts query error:', error)
        // Return default values if there's an error
        return NextResponse.json({
          heartsRemaining: 5,
          totalQuestions: 0,
          resetDate: today
        })
      }

      return NextResponse.json({
        heartsRemaining: usage?.hearts_remaining || 5,
        totalQuestions: usage?.total_questions_asked || 0,
        resetDate: today
      })

    } catch (dbError) {
      console.error('Database error in hearts route:', dbError)
      // Return default values if database fails
      return NextResponse.json({
        heartsRemaining: 5,
        totalQuestions: 0,
        resetDate: today
      })
    }

  } catch (error) {
    console.error('Hearts check error:', error)
    // Always return successful response with default values
    return NextResponse.json({
      heartsRemaining: 5,
      totalQuestions: 0,
      resetDate: new Date().toISOString().split('T')[0]
    })
  }
}