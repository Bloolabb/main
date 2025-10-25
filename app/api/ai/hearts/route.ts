import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient() // Added await here
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      // Return default values for unauthorized users
      return NextResponse.json({
        heartsRemaining: 5,
        totalQuestions: 0,
        resetDate: new Date().toISOString().split('T')[0],
        canAskQuestions: true
      })
    }

    try {
      // Use the database function to get user's AI usage
      const { data: usageData, error: usageError } = await supabase
        .rpc('get_user_ai_usage', { user_uuid: user.id })

      if (usageError) {
        console.error('Error getting user AI usage:', usageError)
        // Return default values on error
        return NextResponse.json({
          heartsRemaining: 5,
          totalQuestions: 0,
          resetDate: new Date().toISOString().split('T')[0],
          canAskQuestions: true
        })
      }

      if (usageData && usageData.length > 0) {
        const usage = usageData[0]
        return NextResponse.json({
          heartsRemaining: usage.hearts_remaining,
          totalQuestions: usage.total_questions_asked,
          resetDate: usage.hearts_reset_date,
          canAskQuestions: usage.can_ask_questions
        })
      } else {
        // No usage record found, return defaults
        return NextResponse.json({
          heartsRemaining: 5,
          totalQuestions: 0,
          resetDate: new Date().toISOString().split('T')[0],
          canAskQuestions: true
        })
      }

    } catch (dbError) {
      console.error('Database error in hearts route:', dbError)
      // Return default values if database fails
      return NextResponse.json({
        heartsRemaining: 5,
        totalQuestions: 0,
        resetDate: new Date().toISOString().split('T')[0],
        canAskQuestions: true
      })
    }

  } catch (error) {
    console.error('Hearts check error:', error)
    // Always return successful response with default values
    return NextResponse.json({
      heartsRemaining: 5,
      totalQuestions: 0,
      resetDate: new Date().toISOString().split('T')[0],
      canAskQuestions: true
    })
  }
}
