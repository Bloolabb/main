"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, BookOpen, Play } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface LessonContentProps {
  lesson: any
  userProgress: any
  allLessons: any[]
  trackId: string
  moduleId: string
  userId: string
}

export function LessonContent({ lesson, userProgress, allLessons, trackId, moduleId, userId }: LessonContentProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const currentLessonIndex = allLessons.findIndex((l) => l.id === lesson.id)
  const nextLesson = allLessons[currentLessonIndex + 1]
  const prevLesson = allLessons[currentLessonIndex - 1]

  const lessonSteps = [
    {
      type: "intro",
      title: "Getting Started",
      content: `Welcome to "${lesson.title}"! ${lesson.description || "Let's begin your learning journey."}`,
    },
    {
      type: "content",
      title: lesson.title,
      content: generateLessonContent(lesson),
    },
    {
      type: "summary",
      title: "Ready to Practice",
      content: `Great work! You've completed the lesson content. Ready to test your knowledge with some exercises?`,
    },
  ]

  const handleNext = () => {
    if (currentStep < lessonSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsLoading(true)
      router.push(`/learn/${trackId}/${moduleId}/${lesson.id}/exercises`)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progressPercent = ((currentStep + 1) / lessonSteps.length) * 100

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" className="text-gray-600 hover:text-gray-800">
          <Link href={`/learn/${trackId}/${moduleId}`} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Module</span>
          </Link>
        </Button>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BookOpen className="h-4 w-4" />
          <span>{lesson.modules?.learning_tracks?.title}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700">Lesson Progress</span>
          <span className="text-gray-600">
            {currentStep + 1} of {lessonSteps.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-4 border-b border-gray-100">
          <CardTitle className="text-2xl text-gray-900">{lessonSteps[currentStep].title}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            {lessonSteps[currentStep].content}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          onClick={handlePrev}
          disabled={currentStep === 0}
          variant="outline"
          className="flex items-center gap-2 border-gray-300 text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="flex gap-1">
          {lessonSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index <= currentStep ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          className="flex items-center gap-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 font-medium"
          disabled={isLoading}
        >
          <span>
            {currentStep === lessonSteps.length - 1 ? (isLoading ? "Loading..." : "Start Exercises") : "Next"}
          </span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Lesson Navigation */}
      {currentStep === lessonSteps.length - 1 && (
        <div className="flex justify-between pt-6 border-t border-gray-200">
          {prevLesson ? (
            <Button asChild variant="outline" className="border-gray-300 text-gray-700">
              <Link href={`/learn/${trackId}/${moduleId}/${prevLesson.id}`}>
                ← {prevLesson.title}
              </Link>
            </Button>
          ) : (
            <div />
          )}

          {nextLesson ? (
            <Button asChild className="bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
              <Link href={`/learn/${trackId}/${moduleId}/${nextLesson.id}`}>
                {nextLesson.title} →
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="border-gray-300 text-gray-700">
              <Link href={`/learn/${trackId}/${moduleId}`}>Finish Module</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

function generateLessonContent(lesson: any): string {
  const aiLessons: Record<string, string> = {
    "AI Definition": `Artificial Intelligence (AI) is the simulation of human intelligence in machines that are programmed to think and learn like humans. 

Key characteristics of AI:
• Learning: AI systems can improve their performance through experience
• Reasoning: They can solve problems and make decisions
• Perception: AI can interpret and understand sensory data
• Language: Many AI systems can understand and generate human language

Think of AI like teaching a computer to be smart in the same way humans are smart. Just like you learn from experience, AI learns from data and examples to get better at tasks.

Examples you might know:
- Voice assistants like Siri or Alexa
- Recommendation systems on Netflix or YouTube
- Photo recognition that tags your friends automatically
- GPS navigation that finds the best route

AI isn't magic - it's math and computer science working together to create systems that can perform tasks that typically require human intelligence.`,

    "Types of AI": `There are different types of AI systems, each with varying levels of capability:

**Narrow AI (Weak AI)**
- Designed for specific tasks
- Examples: Chess computers, spam filters, image recognition
- This is what we have today - very good at one thing

**General AI (Strong AI)**  
- Would match human intelligence across all domains
- Can learn any intellectual task a human can
- This doesn't exist yet - it's still science fiction

**Superintelligent AI**
- Would exceed human intelligence in all areas
- Theoretical future possibility
- Subject of much debate among researchers

**Current AI Categories:**
- Machine Learning: Systems that learn from data
- Deep Learning: AI inspired by how brains work
- Natural Language Processing: AI that understands language
- Computer Vision: AI that can "see" and interpret images
- Robotics: AI that controls physical machines

Most AI today is "narrow" - really good at specific tasks but can't do everything a human can do.`,

    "Spotting Opportunities": `Great entrepreneurs are opportunity detectives! They see problems everywhere and think "How can I solve this?"

**Where to Look for Opportunities:**

1. **Daily Frustrations**
   - What annoys you or your friends regularly?
   - Long lines, confusing apps, expensive products
   - Example: Uber solved the frustration of waiting for taxis

2. **Emerging Trends**
   - New technologies creating possibilities
   - Changing social behaviors
   - Example: TikTok capitalized on short-form video trend

3. **Underserved Markets**
   - Groups of people not well served by existing solutions
   - Geographic areas without good options
   - Example: Duolingo made language learning free and fun

4. **Inefficient Processes**
   - Things that take too long or cost too much
   - Manual processes that could be automated
   - Example: Venmo simplified splitting bills with friends

**The Opportunity Mindset:**
- Ask "Why does this have to be this way?"
- Listen to people complain - complaints = opportunities
- Look for gaps between what exists and what people want
- Think about how technology could improve old solutions

Remember: The best opportunities often seem obvious in hindsight, but someone had to see them first!`,
  }

  return (
    aiLessons[lesson.title] ||
    `This is the content for "${lesson.title}". 

In this lesson, you'll learn important concepts that will help you understand ${lesson.title.toLowerCase()}. 

Key points to remember:
• This topic is fundamental to your learning journey
• Understanding these concepts will help in future lessons  
• Take your time to absorb the information
• Don't hesitate to review if needed

Let's explore this topic together and build your knowledge step by step!`
  )
}