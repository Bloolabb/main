import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

// Content moderation keywords (basic client-side filtering)
const BLOCKED_KEYWORDS = [
  // Personal information requests
  'password', 'address', 'phone number', 'social security', 'credit card',
  // Inappropriate content
  'hate', 'violence', 'bully', 'hurt', 'dangerous',
  // Adult content
  'adult', 'explicit', 'nsfw', 'porn', 'sexual'
];

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      await logError(supabase, null, 'Unauthorized access attempt', { ip: request.ip })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, conversationId } = await request.json()
    
    if (!message?.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 })
    }

    // Content moderation check
    const moderationResult = await moderateContent(message, user.id, supabase)
    if (moderationResult.blocked) {
      return NextResponse.json({ 
        error: 'content_moderated', 
        message: 'Please ask a different question that follows our community guidelines.' 
      }, { status: 400 })
    }

    // 1️⃣ Check today's hearts with enhanced security
    const today = new Date().toISOString().split('T')[0]
    const { data: usage, error: usageError } = await supabase
      .from('user_ai_usage')
      .select('*')
      .eq('user_id', user.id)
      .eq('hearts_reset_date', today)
      .single()

    if (usageError && usageError.code !== 'PGRST116') {
      await logError(supabase, user.id, 'Usage check failed', { error: usageError })
    }

    const heartsRemaining = usage?.hearts_remaining ?? 5
    if (heartsRemaining <= 0) {
      return NextResponse.json({ 
        error: 'out_of_hearts', 
        message: 'You used all your hearts for today! Come back tomorrow for more learning!' 
      }, { status: 403 })
    }

    // 2️⃣ Get user age group for appropriate responses
    const ageGroup = await getUserAgeGroup(user.id, supabase)

    // 3️⃣ Try OpenRouter first with enhanced safety settings
    let aiResponse: string
    let apiUsed = 'gemini' // default fallback
    
    try {
      aiResponse = await callOpenRouterAPI(message, ageGroup)
      apiUsed = 'openrouter'
    } catch (err) {
      console.error('OpenRouter failed:', err)
      await logError(supabase, user.id, 'OpenRouter API failed', { error: err, message })
      
      try {
        aiResponse = await callGeminiAPI(message, ageGroup)
        apiUsed = 'gemini'
      } catch (geminiErr) {
        await logError(supabase, user.id, 'Gemini API failed', { error: geminiErr, message })
        throw new Error('All AI services are currently unavailable')
      }
    }

    // 4️⃣ Validate AI response
    if (!aiResponse?.trim()) {
      await logError(supabase, user.id, 'Empty AI response', { message, apiUsed })
      aiResponse = "I'm having trouble thinking of a good answer right now. Could you try asking in a different way?"
    }

    // 5️⃣ Update hearts in Supabase
    const newHearts = heartsRemaining - 1
    const totalQuestions = (usage?.total_questions_asked ?? 0) + 1
    
    const { error: updateError } = await supabase
      .from('user_ai_usage')
      .upsert({
        user_id: user.id,
        hearts_remaining: newHearts,
        total_questions_asked: totalQuestions,
        hearts_reset_date: today,
        last_used_at: new Date().toISOString()
      }, { 
        onConflict: 'user_id,hearts_reset_date',
        ignoreDuplicates: false 
      })

    if (updateError) {
      await logError(supabase, user.id, 'Hearts update failed', { error: updateError })
    }

    // 6️⃣ Log the interaction for safety monitoring
    await logInteraction(supabase, user.id, message, aiResponse, ageGroup, apiUsed)

    return NextResponse.json({
      success: true,
      response: aiResponse,
      heartsRemaining: newHearts,
      conversationId: conversationId || generateConversationId()
    })
  } catch (error) {
    console.error("AI Chat Error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// Enhanced OpenRouter call with safety settings
async function callOpenRouterAPI(message: string, ageGroup: string): Promise<string> {
  const systemPrompt = getSystemPrompt(ageGroup)
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.com',
      'X-Title': 'Kids AI Tutor'
    },
    body: JSON.stringify({
      model: "anthropic/claude-3-haiku",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenRouter API failed: ${response.status} - ${errorText}`)
  }
  
  const data = await response.json()
  return data.choices[0]?.message?.content?.trim() || "I couldn't generate a proper response. Please try again."
}

// Enhanced Gemini call
async function callGeminiAPI(message: string, ageGroup: string): Promise<string> {
  const prompt = `As a friendly tutor for ${ageGroup} year olds, answer this in a simple, educational way: ${message}`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: prompt }],
          role: "user"
        }],
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      }),
    }
  )

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Gemini API failed: ${response.status} - ${JSON.stringify(errorData)}`)
  }
  
  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Sorry, I couldn't find an answer."
}

// Content moderation function
async function moderateContent(message: string, userId: string, supabase: any): Promise<{ blocked: boolean; categories: string[] }> {
  const lowerMessage = message.toLowerCase()
  const flaggedCategories: string[] = []

  // Basic keyword filtering
  BLOCKED_KEYWORDS.forEach(keyword => {
    if (lowerMessage.includes(keyword.toLowerCase())) {
      flaggedCategories.push(keyword)
    }
  })

  // Length check to prevent abuse
  if (message.length > 1000) {
    flaggedCategories.push('excessive_length')
  }

  const blocked = flaggedCategories.length > 0

  // Log moderation event
  if (blocked) {
    await supabase
      .from('content_moderation_logs')
      .insert({
        user_id: userId,
        input_text: message.substring(0, 500), // Limit stored text
        flagged_categories: flaggedCategories,
        moderation_score: flaggedCategories.length / BLOCKED_KEYWORDS.length,
        was_blocked: true
      })
  }

  return { blocked, categories: flaggedCategories }
}

// System prompt based on age group
function getSystemPrompt(ageGroup: string): string {
  const basePrompt = "You are a friendly, patient AI tutor for children. Always be encouraging, use simple language, and include educational examples."
  
  const ageSpecificPrompts = {
    '6-9': `${basePrompt} Use very simple words, lots of emojis 🎨✨, and short sentences. Focus on concrete concepts.`,
    '10-12': `${basePrompt} Use clear explanations with examples. You can introduce some new vocabulary with definitions. Use some emojis for engagement.`,
    '13-16': `${basePrompt} You can discuss more complex topics but keep explanations accessible. Encourage critical thinking.`
  }

  return ageSpecificPrompts[ageGroup as keyof typeof ageSpecificPrompts] || ageSpecificPrompts['13-16']
}

// Helper functions
async function getUserAgeGroup(userId: string, supabase: any): Promise<string> {
  // You might want to store age group in user metadata or a profiles table
  // For now, return a default - implement based on your user data structure
  return '10-12'
}

async function logInteraction(supabase: any, userId: string, message: string, response: string, ageGroup: string, apiUsed: string) {
  await supabase
    .from('ai_interaction_logs')
    .insert({
      user_id: userId,
      message: message.substring(0, 1000), // Limit length
      response: response.substring(0, 2000), // Limit length
      age_group: ageGroup,
      api_used: apiUsed,
      tokens_used: Math.ceil((message.length + response.length) / 4) // Rough estimate
    })
}

async function logError(supabase: any, userId: string | null, error: string, additionalData?: any) {
  await supabase
    .from('ai_error_logs')
    .insert({
      user_id: userId,
      error: error.substring(0, 1000),
      request_data: additionalData,
      stack: new Error().stack?.substring(0, 2000),
      timestamp: new Date().toISOString()
    })
}

function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}