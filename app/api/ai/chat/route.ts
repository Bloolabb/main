import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { message } = await request.json()
    if (!message?.trim()) return NextResponse.json({ error: "Message required" }, { status: 400 })

    // 1️⃣ Check today's hearts
    const today = new Date().toISOString().split('T')[0]
    const { data: usage } = await supabase
      .from('user_ai_usage')
      .select('*')
      .eq('user_id', user.id)
      .eq('hearts_reset_date', today)
      .single()

    const heartsRemaining = usage?.hearts_remaining ?? 5
    if (heartsRemaining <= 0) {
      return NextResponse.json({ error: 'out_of_hearts', message: 'You used all your hearts for today!' }, { status: 403 })
    }

    // 2️⃣ Try OpenRouter first
    let aiResponse: string
    try {
      aiResponse = await callOpenRouterAPI(message)
    } catch (err) {
      console.error('OpenRouter failed:', err)
      aiResponse = await callGeminiAPI(message)
    }

    // 3️⃣ Update hearts in Supabase
    const newHearts = heartsRemaining - 1
    const totalQuestions = (usage?.total_questions_asked ?? 0) + 1
    await supabase
      .from('user_ai_usage')
      .upsert({
        user_id: user.id,
        hearts_remaining: newHearts,
        total_questions_asked: totalQuestions,
        hearts_reset_date: today
      }, { onConflict: 'user_id,hearts_reset_date' })

    return NextResponse.json({
      success: true,
      response: aiResponse,
      heartsRemaining: newHearts,
    })
  } catch (error) {
    console.error("AI Chat Error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// OpenRouter call
async function callOpenRouterAPI(message: string): Promise<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: "anthropic/claude-3-haiku", // better for kids
      messages: [
        {
          role: "system",
          content: "You are a friendly AI tutor for kids aged 6–16. Explain in simple terms with examples and emojis."
        },
        { role: "user", content: message }
      ],
      max_tokens: 400,
    }),
  })

  if (!response.ok) throw new Error(`OpenRouter API failed: ${response.status}`)
  const data = await response.json()
  return data.choices[0].message.content
}

// Gemini fallback
async function callGeminiAPI(message: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Answer for a kid: ${message}` }] }]
      }),
    }
  )

  if (!response.ok) throw new Error(`Gemini API failed: ${response.status}`)
  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I couldn’t find an answer."
}
