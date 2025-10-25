import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

// Add memory system from first code
const conversationCache = new Map<string, { messages: { role: 'user' | 'assistant'; content: string }[]; lastUpdated: number }>()
const CONV_TTL = 1000 * 60 * 60 // 1 hour
const MAX_HISTORY_MESSAGES = 5

function getConversation(conversationId: string) {
  const record = conversationCache.get(conversationId)
  if (!record) return []
  if (Date.now() - record.lastUpdated > CONV_TTL) {
    conversationCache.delete(conversationId)
    return []
  }
  return record.messages
}

function appendConversation(conversationId: string, role: 'user' | 'assistant', content: string) {
  const now = Date.now()
  const record = conversationCache.get(conversationId) || { messages: [], lastUpdated: now }
  record.messages.push({ role, content })
  // keep only last N messages
  if (record.messages.length > MAX_HISTORY_MESSAGES) {
    record.messages = record.messages.slice(-MAX_HISTORY_MESSAGES)
  }
  record.lastUpdated = now
  conversationCache.set(conversationId, record)
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, conversationId: incomingConversationId } = await request.json()
    
    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Validate input length
    if (message.length > 500) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 })
    }

    // Memory: Get or create conversation ID
    const conversationId = incomingConversationId || generateConversationId()
    const isContinuation = Boolean(incomingConversationId)
    
    // Memory: Get conversation history
    const history = getConversation(conversationId)
    
    // Memory: Store user message
    appendConversation(conversationId, 'user', message)

    // 1️⃣ Use the database function to check and decrement hearts
    const { data: heartUsage, error: heartError } = await supabase
      .rpc('use_ai_heart', { user_uuid: user.id })

    if (heartError) {
      console.error('Heart usage error:', heartError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!heartUsage || heartUsage.length === 0 || !heartUsage[0].success) {
      return NextResponse.json(
        { 
          error: 'out_of_hearts', 
          message: heartUsage?.[0]?.message || 'No hearts remaining for today' 
        }, 
        { status: 429 }
      )
    }

    const usage = heartUsage[0]

    // 2️⃣ Call AI API with memory context
    let aiResponse: string
    let usedModel = 'unknown'
    
    try {
      aiResponse = await callOpenRouterAPI(message, history, isContinuation)
      usedModel = 'openrouter'
    } catch (err) {
      console.error('OpenRouter failed:', err)
      try {
        aiResponse = await callGeminiAPI(message, history, isContinuation)
        usedModel = 'gemini'
      } catch (geminiErr) {
        console.error('Gemini also failed:', geminiErr)
        // Fallback response
        aiResponse = `I understand you're asking about "${message}". As your AI tutor, I'd love to help you learn more about this topic! This is a great question for exploring new ideas. 🧠✨`
        usedModel = 'fallback'
      }
    }

    // Memory: Store AI response
    appendConversation(conversationId, 'assistant', aiResponse)

    // 3️⃣ Save conversation to database
    let savedConversationId = conversationId
    try {
      const conversationTitle = message.slice(0, 50) + (message.length > 50 ? '...' : '')
      
      const { data: conversationData, error: conversationError } = await supabase
        .rpc('save_ai_conversation', {
          user_uuid: user.id,
          conversation_title: conversationTitle,
          user_message: message,
          ai_response: aiResponse,
          existing_conversation_id: conversationId
        })

      if (conversationError) {
        console.error('Failed to save conversation:', conversationError)
      } else if (conversationData && conversationData.length > 0) {
        savedConversationId = conversationData[0].conversation_id
      }
    } catch (saveError) {
      console.error('Error saving conversation:', saveError)
      // Don't fail the request if saving conversation fails
    }

    return NextResponse.json({
      response: aiResponse,
      heartsRemaining: usage.hearts_remaining,
      totalQuestions: usage.total_questions,
      conversationId: savedConversationId,
      modelUsed: usedModel
    })

  } catch (error) {
    console.error("AI Chat Error:", error)
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    )
  }
}

// Enhanced OpenRouter call with memory
async function callOpenRouterAPI(message: string, history: { role: string; content: string }[], isContinuation: boolean): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured')
  }

  // Build messages with memory context
  const messages: any[] = [
    {
      role: "system",
      content: getSystemPrompt(!isContinuation)
    }
  ]

  // Add conversation history if available
  for (const h of history || []) {
    messages.push({ role: h.role, content: h.content })
  }

  // Add current message
  messages.push({ 
    role: "user", 
    content: message 
  })

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://yourapp.com',
      'X-Title': 'AI Learning Platform'
    },
    body: JSON.stringify({
      model: "anthropic/claude-3-haiku",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenRouter API failed: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  
  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Invalid response format from OpenRouter')
  }

  return data.choices[0].message.content
}

// Enhanced Gemini call with memory
async function callGeminiAPI(message: string, history: { role: string; content: string }[], isContinuation: boolean): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured')
  }

  // Build prompt with memory context
  const systemPrompt = getSystemPrompt(!isContinuation)
  
  let historyText = ''
  if (history && history.length) {
    historyText = history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n') + '\n'
  }

  const fullPrompt = `${systemPrompt}

Recent conversation:
${historyText}User: ${message}

Respond as the same AI tutor, do not re-introduce yourself if this is a continuation.`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7
        }
      }),
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Gemini API failed: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  
  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error('Invalid response format from Gemini')
  }

  return data.candidates[0].content.parts[0].text
}

// System prompt with memory awareness
function getSystemPrompt(isNewConversation: boolean): string {
  const basePrompt = `You are a friendly AI tutor for kids and teenagers aged 6-16. Your role is to:
- Explain concepts in simple, engaging terms
- Use age-appropriate examples and analogies
- Include relevant emojis to make learning fun
- Be encouraging and positive
- Focus on educational content about AI, technology, business, and entrepreneurship
- Keep responses under 300 words
- Always maintain a safe, appropriate tone
- Only ask one question at a time and wait for student responses
- Never move on until the student responds`

  const intro = isNewConversation 
    ? "Start by briefly introducing yourself as the AI tutor and ask what the student would like to learn about."
    : "This is a continuation of an existing conversation. Do NOT re-introduce yourself. Continue from the previous context."

  return `${basePrompt}\n\n${intro}\n\nIf asked about inappropriate topics, gently redirect to learning-focused subjects.`
}

// Helper function from first code
function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}