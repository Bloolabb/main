// exercise-results.tsx (Fixed)
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, X, Trophy, Star, RotateCcw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ExerciseResultsProps {
  lesson: any
  score: number
  totalQuestions: number
  answers: Record<number, string>
  exercises: any[]
  allLessons: any[]
  trackId: string
  moduleId: string
}

export function ExerciseResults({
  lesson,
  score,
  totalQuestions,
  answers,
  exercises,
  allLessons,
  trackId,
  moduleId,
}: ExerciseResultsProps) {
  const router = useRouter()
  
  const correctAnswers = exercises.filter((exercise, index) => {
    const userAnswer = answers[index]
    const correctAnswer = exercise.correct_answer

    if (!userAnswer || !correctAnswer) return false

    if (exercise.type === "fill_blank") {
      // For fill_blank exercises, split and normalize both answers
      const userAnswers = userAnswer.split(';').map((ans: string) => ans.trim().toLowerCase())
      const correctAnswers = correctAnswer.split(';').map((ans: string) => ans.trim().toLowerCase())
      
      // Check if all answers match (order matters)
      return userAnswers.length === correctAnswers.length && 
        userAnswers.every((ans: string, i: number) => ans === correctAnswers[i])
    } else {
      // For other types, simple normalized comparison
      return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
    }
  }).length

  const passed = score >= 70
  const currentLessonIndex = allLessons.findIndex((l) => l.id === lesson.id)
  const nextLesson = allLessons[currentLessonIndex + 1]

  const getScoreColor = () => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-blue-600"
    return "text-red-600"
  }

  const getScoreIcon = () => {
    if (score >= 90) return <Trophy className="h-8 w-8 text-yellow-500" />
    if (score >= 70) return <CheckCircle className="h-8 w-8 text-green-500" />
    return <X className="h-8 w-8 text-red-500" />
  }

  const getScoreMessage = () => {
    if (score >= 90) return "Outstanding! You're a star learner!"
    if (score >= 70) return "Great job! You passed the lesson!"
    return "Keep trying! You'll get it next time!"
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Results Header */}
      <Card className="border-2 border-gray-100 shadow-xl">
        <CardHeader
          className={`text-center ${passed ? "bg-linear-to-r from-green-500 to-blue-600" : "bg-linear-to-r from-red-500 to-orange-600"} text-white`}
        >
          <div className="flex justify-center mb-4">{getScoreIcon()}</div>
          <CardTitle className="text-3xl font-bold">{getScoreMessage()}</CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-2">
            <div className={`text-6xl font-bold ${getScoreColor()}`}>{score}%</div>
            <div className="text-gray-600">
              {correctAnswers} out of {totalQuestions} questions correct
            </div>
          </div>

          {passed && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 text-green-800">
                <Star className="h-5 w-5" />
                <span className="font-semibold">+{lesson.xp_reward} XP Earned!</span>
              </div>
            </div>
          )}

          {!passed && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="text-yellow-800">
                <strong>Need 70% to pass.</strong> Review the lesson and try again!
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Question Review */}
      <Card className="border-2 border-gray-100 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Question Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {exercises.map((exercise, index) => {
            const userAnswer = answers[index]
            const isCorrect = exercise.type === "fill_blank"
              ? (() => {
                  const userAnswers = userAnswer?.split(';').map((ans: string) => ans.trim().toLowerCase()) || []
                  const correctAnswers = exercise.correct_answer?.split(';').map((ans: string) => ans.trim().toLowerCase()) || []
                  return userAnswers.length === correctAnswers.length && 
                    userAnswers.every((ans: string, i: number) => ans === correctAnswers[i])
                })()
              : userAnswer?.toLowerCase()?.trim() === exercise.correct_answer?.toLowerCase()?.trim()

            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className={`mt-1 ${isCorrect ? "text-green-500" : "text-red-500"}`}>
                    {isCorrect ? <CheckCircle className="h-5 w-5" /> : <X className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="font-medium text-gray-800">
                      Question {index + 1}: {exercise.question}
                    </div>
                    <div className="text-sm space-y-1">
                      <div className={`${isCorrect ? "text-green-700" : "text-red-700"}`}>
                        Your answer: {userAnswer || "No answer"}
                      </div>
                      {!isCorrect && <div className="text-green-700">Correct answer: {exercise.correct_answer}</div>}
                      {exercise.explanation && (
                        <div className="text-gray-600 bg-gray-50 p-2 rounded mt-2">
                          <strong>Explanation:</strong> {exercise.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-center space-x-4">
        {!passed && (
          <Button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </Button>
        )}

        <Button asChild variant="outline" className="border-2 border-gray-200 bg-transparent">
          <Link href={`/learn/${trackId}/${moduleId}/${lesson.id}`}>Review Lesson</Link>
        </Button>

        {passed && nextLesson ? (
          <Button asChild className="bg-green-500 hover:bg-green-600">
            <Link href={`/learn/${trackId}/${moduleId}/${nextLesson.id}`}>Next Lesson</Link>
          </Button>
        ) : passed ? (
          <Button asChild className="bg-blue-500 hover:bg-blue-600">
            <Link href={`/learn/${trackId}/${moduleId}`}>Back to Module</Link>
          </Button>
        ) : null}
      </div>
    </div>
  )
}