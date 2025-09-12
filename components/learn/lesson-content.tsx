"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react"
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
      title: "Lesson Introduction",
      content: `Welcome to "${lesson.title}"! ${lesson.description || "Let's dive into this exciting topic."}`,
    },
    {
      type: "content",
      title: lesson.title,
      content: generateLessonContent(lesson),
    },
    {
      type: "summary",
      title: "Lesson Summary",
      content: `Great job completing "${lesson.title}"! You've earned ${lesson.xp_reward} XP. Ready to test your knowledge?`,
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" className="text-gray-600 hover:text-gray-800">
          <Link href={`/learn/${trackId}/${moduleId}`} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Module</span>
          </Link>
        </Button>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
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
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Content */}
      <Card className="border-2 border-gray-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardTitle className="text-2xl">{lessonSteps[currentStep].title}</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">{lessonSteps[currentStep].content}</div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          onClick={handlePrev}
          disabled={currentStep === 0}
          variant="outline"
          className="flex items-center space-x-2 bg-transparent"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="flex space-x-2">
          {lessonSteps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${index <= currentStep ? "bg-blue-500" : "bg-gray-200"}`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600"
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
        <div className="flex justify-between pt-4 border-t border-gray-200">
          {prevLesson ? (
            <Button asChild variant="outline">
              <Link href={`/learn/${trackId}/${moduleId}/${prevLesson.id}`}>← Previous Lesson: {prevLesson.title}</Link>
            </Button>
          ) : (
            <div />
          )}

          {nextLesson ? (
            <Button asChild>
              <Link href={`/learn/${trackId}/${moduleId}/${nextLesson.id}`}>Next Lesson: {nextLesson.title} →</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href={`/learn/${trackId}/${moduleId}`}>Back to Module</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

function generateLessonContent(lesson: any): string {
  // Generate educational content based on lesson title
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
