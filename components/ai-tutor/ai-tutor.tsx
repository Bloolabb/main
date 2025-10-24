"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Sparkles, Plus, Lightbulb, Heart, Zap, Crown, Shield, AlertTriangle } from "lucide-react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  isError?: boolean
}

interface HeartsData {
  heartsRemaining: number
  totalQuestions: number
  resetDate: string
}

const suggestedQuestions = [
  "What is AI and how does it work?",
  "How can kids start a business?",
  "What's the difference between AI and human thinking?",
  "How do entrepreneurs solve problems?",
  "Can AI be creative like humans?",
  "What makes a good business idea?",
  "How do computers learn from data?",
  "What is machine learning?"
]

export function AITutors() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hearts, setHearts] = useState<HeartsData>({ heartsRemaining: 5, totalQuestions: 0, resetDate: '' })
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [securityWarning, setSecurityWarning] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load hearts on component mount
  useEffect(() => {
    loadHearts()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadHearts = async () => {
    try {
      const response = await fetch('/api/ai/hearts')
      if (response.ok) {
        const data = await response.json()
        setHearts(data)
      }
    } catch (error) {
      console.error('Failed to load hearts:', error)
      setHearts({ heartsRemaining: 5, totalQuestions: 0, resetDate: new Date().toISOString().split('T')[0] })
    }
  }

  const validateInput = (text: string): { valid: boolean; warning?: string } => {
    if (text.length > 500) {
      return { valid: false, warning: "Questions should be under 500 characters" }
    }
    
    const suspiciousPatterns = [
      /password|credit.card|social.security/gi,
      /http[s]?:\/\//gi,
      /<script|javascript:/gi
    ]
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(text)) {
        return { valid: false, warning: "Please ask a learning-focused question" }
      }
    }
    
    return { valid: true }
  }

  const handleSend = async (question?: string) => {
    const messageContent = question || input
    if (!messageContent.trim()) return

    // Validate input
    const validation = validateInput(messageContent)
    if (!validation.valid) {
      setSecurityWarning(validation.warning || "Invalid input")
      setTimeout(() => setSecurityWarning(null), 5000)
      return
    }

    // Check hearts
    if (hearts.heartsRemaining <= 0) {
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      role: "user",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    if (!question) setInput("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContent,
          conversationId: conversationId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === 'out_of_hearts') {
          setHearts(prev => ({ ...prev, heartsRemaining: 0 }))
          throw new Error(data.message)
        } else if (data.error === 'content_moderated') {
          throw new Error("Please ask a learning-focused question about AI, business, or technology.")
        }
        throw new Error(data.error || 'Failed to get AI response')
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: "assistant",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      setHearts(prev => ({
        ...prev,
        heartsRemaining: data.heartsRemaining,
        totalQuestions: prev.totalQuestions + 1
      }))
      
      if (data.conversationId) {
        setConversationId(data.conversationId)
      }

    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `${
          error instanceof Error && error.message.includes('learning-focused') 
            ? '🚫 ' + error.message
            : `🤖 **AI Tutor Says:**\n\nI'm here to help you learn! Let me answer your question about "${messageContent}"...\n\n${error instanceof Error ? error.message : 'Something went wrong. Please try again!'}`
        }`,
        role: "assistant",
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const startNewChat = () => {
    setMessages([])
    setInput("")
    setConversationId(null)
    setSecurityWarning(null)
  }

  const hasHearts = hearts.heartsRemaining > 0

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            AI Learning Buddy
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-500" />
            {hasHearts 
              ? `Safe learning environment • ${hearts.heartsRemaining} hearts left` 
              : "Come back tomorrow for more learning! 💫"
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={startNewChat}
            variant="outline"
            className="flex items-center gap-2"
            disabled={messages.length === 0}
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
      </div>

      {/* Security Warning */}
      {securityWarning && (
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span className="text-yellow-800 text-sm">{securityWarning}</span>
          </CardContent>
        </Card>
      )}

      {/* Hearts System */}
      <Card className="border-2 border-pink-200 bg-pink-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
                <span className="font-semibold text-pink-700">Learning Hearts</span>
              </div>
              <Badge variant="secondary" className="bg-white">
                {hearts.heartsRemaining} / 5 today
              </Badge>
            </div>
            <div className="text-sm text-pink-600">
              {hearts.totalQuestions} questions asked
            </div>
          </div>
          
          {/* Hearts Visual */}
          <div className="flex gap-1 mt-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  index < hearts.heartsRemaining
                    ? 'bg-pink-500 animate-pulse'
                    : 'bg-pink-200'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Out of Hearts Message */}
      {!hasHearts && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <Crown className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">Amazing Learning Today! 🎉</h3>
            <p className="text-green-700 mb-4">
              You've used all your hearts for today! You're becoming a tech expert! 
              Come back tomorrow for more learning adventures.
            </p>
            <div className="text-sm text-green-600">
              <p>✨ Great job asking {hearts.totalQuestions} questions today! ✨</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggested Questions */}
      {hasHearts && messages.length === 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lightbulb className="h-4 w-4" />
            <span>Try these questions to start learning:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestedQuestions.map((question, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200 p-3 text-sm font-normal justify-start h-auto whitespace-normal text-left"
                onClick={() => handleSend(question)}
              >
                {question}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input */}
      {hasHearts && (
        <div className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about AI, business, or technology... (${hearts.heartsRemaining} hearts left)`}
            className="h-14 text-lg pr-20 border-2 border-primary/20 focus:border-primary transition-colors shadow-sm"
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            maxLength={500}
          />
          <div className="absolute right-20 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
            {input.length}/500
          </div>
          <Button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim() || !hasHearts}
            size="lg"
            className="absolute right-2 top-2 h-10 px-4 gap-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Ask
              </>
            )}
          </Button>
        </div>
      )}

      {/* Messages */}
      <div className="space-y-4 min-h-[400px]">
        {messages.map((message) => (
          <Card 
            key={message.id} 
            className={`border transition-all duration-200 hover:shadow-sm ${
              message.role === "user" 
                ? "border-blue-200 bg-blue-50/50" 
                : message.isError
                ? "border-yellow-200 bg-yellow-50/50"
                : "border-green-200 bg-green-50/50"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  message.role === "user" 
                    ? "bg-blue-500 text-white" 
                    : message.isError
                    ? "bg-yellow-500 text-white"
                    : "bg-green-500 text-white"
                }`}>
                  {message.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`whitespace-pre-wrap leading-relaxed ${
                    message.isError ? "text-yellow-800" : "text-gray-700"
                  }`}>
                    {message.content}
                  </div>
                  <div className="text-xs text-muted-foreground mt-3 flex items-center gap-2">
                    <span>{message.role === "user" ? "You" : message.isError ? "Notice" : "AI Tutor"}</span>
                    <span>•</span>
                    <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {isLoading && (
          <Card className="border border-green-200 bg-green-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 text-green-600">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 bg-green-600 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="h-2 w-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                    <span className="text-sm">AI is thinking... 🧠</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}