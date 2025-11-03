// exercise-engine.tsx (Fixed)
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MultipleChoiceExercise } from "./multiple-choice-exercise"
import { FillBlankExercise } from "./fill-blank-exercise"
import { CaseStudyExercise } from "./case-study-exercise"
import { ExerciseResults } from "./exercise-results"
import { createClient } from "@/lib/supabase/client"

interface ExerciseEngineProps {
  lesson: any
  exercises: any[]
  userProgress: any
  allLessons: any[]
  trackId: string
  moduleId: string
  userId: string
}

export function ExerciseEngine({
  lesson,
  exercises,
  userProgress,
  allLessons,
  trackId,
  moduleId,
  userId,
}: ExerciseEngineProps) {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [score, setScore] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isFirstTimePassing, setIsFirstTimePassing] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const progressPercent = exercises.length > 0 ? ((currentExercise + 1) / exercises.length) * 100 : 0
  const currentExerciseData = exercises[currentExercise]

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentExercise]: answer,
    }))
    setError(null)
  }

  const handleNext = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
    } else {
      handleSubmitExercises()
    }
  }

  const handlePrev = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1)
    }
  }

  const calculateScore = () => {
    let correct = 0
    exercises.forEach((exercise, index) => {
      const userAnswer = answers[index]
      const correctAnswer = exercise.correct_answer

      if (!userAnswer || !correctAnswer) return

      if (exercise.type === "fill_blank") {
        // For fill_blank exercises, split and normalize both answers
        const userAnswers = userAnswer.split(';').map((ans: string) => ans.trim().toLowerCase())
        const correctAnswers = correctAnswer.split(';').map((ans: string) => ans.trim().toLowerCase())
        
        // Check if all answers match (order matters)
        const allCorrect = userAnswers.length === correctAnswers.length && 
          userAnswers.every((ans: string, i: number) => ans === correctAnswers[i])
        
        if (allCorrect) {
          correct++
        }
      } else {
        // For other types, simple normalized comparison
        if (userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
          correct++
        }
      }
    })
    return exercises.length > 0 ? Math.round((correct / exercises.length) * 100) : 0
  }

  const updateUserXPAndStreak = async (xpReward: number) => {
    const { data: currentProfile, error: profileFetchError } = await supabase
      .from("profiles")
      .select("total_xp, current_streak, longest_streak, last_activity_date")
      .eq("id", userId)
      .single()

    if (profileFetchError) {
      console.error("Profile fetch error:", profileFetchError)
      throw new Error("Failed to fetch user profile")
    }

    if (!currentProfile) {
      throw new Error("User profile not found")
    }

    const newXP = (currentProfile.total_xp || 0) + xpReward
    const today = new Date().toISOString().split("T")[0]
    const lastActivity = currentProfile.last_activity_date

    let newStreak = currentProfile.current_streak || 0
    
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

    const profileUpdate = {
      total_xp: newXP,
      current_streak: newStreak,
      longest_streak: Math.max(newStreak, currentProfile.longest_streak || 0),
      last_activity_date: today,
      updated_at: new Date().toISOString(),
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update(profileUpdate)
      .eq("id", userId)

    if (profileError) {
      console.error("Profile update error:", profileError)
      throw new Error("Failed to update user profile")
    }

    return { newXP, newStreak }
  }

  const handleSubmitExercises = async () => {
    setIsSubmitting(true)
    setError(null)
    const finalScore = calculateScore()
    setScore(finalScore)

    try {
      console.log("Submitting exercises for user:", userId, "lesson:", lesson.id)

      const wasPreviouslyCompleted = userProgress?.completed || false
      const wasXpAlreadyAwarded = userProgress?.xp_awarded || false
      const isPassingScore = finalScore >= 70
      
      // Award XP if: passing score AND XP wasn't awarded before
      const shouldAwardXP = isPassingScore && !wasXpAlreadyAwarded
      setIsFirstTimePassing(shouldAwardXP)

      console.log("XP Awarding Logic:", {
        wasPreviouslyCompleted,
        wasXpAlreadyAwarded,
        isPassingScore,
        shouldAwardXP,
        finalScore
      })

      // First, save the lesson progress
      const progressData = {
        user_id: userId,
        lesson_id: lesson.id,
        completed: isPassingScore,
        score: finalScore,
        attempts: (userProgress?.attempts || 0) + 1,
        completed_at: isPassingScore ? new Date().toISOString() : userProgress?.completed_at,
        xp_awarded: wasXpAlreadyAwarded || shouldAwardXP, // Mark as awarded if we're about to give it
        updated_at: new Date().toISOString(),
      }

      console.log("Progress data:", progressData)

      const { error: progressError } = await supabase
        .from("user_progress")
        .upsert(progressData, {
          onConflict: 'user_id,lesson_id'
        })

      if (progressError) {
        console.error("Progress error details:", progressError)
        throw new Error(`Failed to save progress: ${progressError.message}`)
      }

      console.log("Progress saved successfully")

      // Award XP if eligible
      if (shouldAwardXP) {
        console.log("Awarding XP for first-time completion!")
        await updateUserXPAndStreak(lesson.xp_reward)
        console.log("XP awarded successfully!")
      } else if (isPassingScore) {
        console.log("User passed but XP was already awarded previously.")
      } else {
        console.log("User did not pass (score < 70). No XP awarded.")
      }

      setShowResults(true)
    } catch (error: any) {
      console.error("Error submitting exercises:", error)
      setError(error.message || "There was an error saving your progress. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (exercises.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Button asChild variant="ghost" className="text-gray-600 hover:text-gray-800">
          <Link href={`/learn/${trackId}/${moduleId}/${lesson.id}`} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Lesson</span>
          </Link>
        </Button>

        <Card className="border-2 border-gray-100 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Exercises Available</h2>
            <p className="text-gray-600">This lesson doesn't have exercises yet. Check back soon!</p>
            <Button asChild className="mt-4">
              <Link href={`/learn/${trackId}/${moduleId}`}>Back to Module</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showResults) {
    return (
      <ExerciseResults
        lesson={lesson}
        score={score}
        totalQuestions={exercises.length}
        answers={answers}
        exercises={exercises}
        allLessons={allLessons}
        trackId={trackId}
        moduleId={moduleId}
      />
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" className="text-gray-600 hover:text-gray-800">
          <Link href={`/learn/${trackId}/${moduleId}/${lesson.id}`} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Lesson</span>
          </Link>
        </Button>

        <div className="text-sm text-gray-600">
          Question {currentExercise + 1} of {exercises.length}
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700">Exercise Progress</span>
          <span className="text-gray-600">{Math.round(progressPercent)}% Complete</span>
        </div>
        <Progress value={progressPercent} className="h-3" />
      </div>

      {/* Exercise Content */}
      <Card className="border-2 border-gray-100 shadow-lg">
        <CardHeader className="bg-linear-to-r from-green-500 to-blue-600 text-white">
          <CardTitle className="text-xl">
            {lesson.title} - Exercise {currentExercise + 1}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {currentExerciseData && (
            <>
              {currentExerciseData.type === "multiple_choice" && (
                <MultipleChoiceExercise
                  exercise={currentExerciseData}
                  selectedAnswer={answers[currentExercise]}
                  onAnswer={handleAnswer}
                />
              )}
              {currentExerciseData.type === "fill_blank" && (
                <FillBlankExercise
                  exercise={currentExerciseData}
                  answer={answers[currentExercise]}
                  onAnswer={handleAnswer}
                />
              )}
              {currentExerciseData.type === "case_study" && (
                <CaseStudyExercise
                  exercise={currentExerciseData}
                  selectedAnswer={answers[currentExercise]}
                  onAnswer={handleAnswer}
                  error={error || undefined}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          onClick={handlePrev}
          disabled={currentExercise === 0}
          variant="outline"
          className="flex items-center space-x-2 bg-transparent"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="flex space-x-2">
          {exercises.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index < currentExercise ? "bg-green-500" : index === currentExercise ? "bg-blue-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={!answers[currentExercise] || isSubmitting}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600"
        >
          <span>
            {currentExercise === exercises.length - 1 
              ? (isSubmitting ? "Submitting..." : "Submit Exercises") 
              : "Next"
            }
          </span>
          {currentExercise === exercises.length - 1 ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Show XP Award Message */}
      {isFirstTimePassing && score >= 70 && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>+{lesson.xp_reward} XP Awarded! 🎉</span>
          </div>
        </div>
      )}
    </div>
  )
}