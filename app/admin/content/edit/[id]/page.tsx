"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface Exercise {
  id?: string
  type: "multiple_choice" | "fill_blank" | "case_study"
  question: string
  options?: string[]
  correct_answer: string
  explanation: string
}

interface Lesson {
  id: string
  title: string
  content: string
  xp_reward: number
  exercises: Exercise[]
}

export default function EditContentPage() {
  const params = useParams()
  const router = useRouter()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchLesson()
  }, [params.id])

  const fetchLesson = async () => {
    try {
      const { data: lessonData, error: lessonError } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", params.id)
        .single()

      if (lessonError) throw lessonError

      const { data: exercisesData, error: exercisesError } = await supabase
        .from("exercises")
        .select("*")
        .eq("lesson_id", params.id)
        .order("order_index")

      if (exercisesError) throw exercisesError

      setLesson({
        ...lessonData,
        exercises: exercisesData || [],
      })
    } catch (error) {
      console.error("Error fetching lesson:", error)
      toast.error("Failed to load lesson")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!lesson) return

    setSaving(true)
    try {
      // Update lesson
      const { error: lessonError } = await supabase
        .from("lessons")
        .update({
          title: lesson.title,
          content: lesson.content,
          xp_reward: lesson.xp_reward,
        })
        .eq("id", lesson.id)

      if (lessonError) throw lessonError

      // Update exercises
      for (const exercise of lesson.exercises) {
        if (exercise.id) {
          // Update existing exercise
          const { error } = await supabase
            .from("exercises")
            .update({
              type: exercise.type,
              question: exercise.question,
              options: exercise.options,
              correct_answer: exercise.correct_answer,
              explanation: exercise.explanation,
            })
            .eq("id", exercise.id)

          if (error) throw error
        } else {
          // Create new exercise
          const { error } = await supabase.from("exercises").insert({
            lesson_id: lesson.id,
            type: exercise.type,
            question: exercise.question,
            options: exercise.options,
            correct_answer: exercise.correct_answer,
            explanation: exercise.explanation,
            order_index: lesson.exercises.indexOf(exercise),
          })

          if (error) throw error
        }
      }

      toast.success("Lesson updated successfully!")
      router.push("/admin/content")
    } catch (error) {
      console.error("Error saving lesson:", error)
      toast.error("Failed to save lesson")
    } finally {
      setSaving(false)
    }
  }

  const addExercise = () => {
    if (!lesson) return

    const newExercise: Exercise = {
      type: "multiple_choice",
      question: "",
      options: ["", "", "", ""],
      correct_answer: "",
      explanation: "",
    }

    setLesson({
      ...lesson,
      exercises: [...lesson.exercises, newExercise],
    })
  }

  const updateExercise = (index: number, updates: Partial<Exercise>) => {
    if (!lesson) return

    const updatedExercises = [...lesson.exercises]
    updatedExercises[index] = { ...updatedExercises[index], ...updates }
    setLesson({ ...lesson, exercises: updatedExercises })
  }

  const removeExercise = (index: number) => {
    if (!lesson) return

    const updatedExercises = lesson.exercises.filter((_, i) => i !== index)
    setLesson({ ...lesson, exercises: updatedExercises })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Lesson not found</p>
          <Button asChild>
            <Link href="/admin/content">Back to Content</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/admin/content">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Content
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Edit Lesson</h1>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Lesson Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Lesson Details</CardTitle>
            <CardDescription>Edit the basic lesson information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={lesson.title}
                onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
                placeholder="Lesson title"
              />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={lesson.content}
                onChange={(e) => setLesson({ ...lesson, content: e.target.value })}
                placeholder="Lesson content (supports markdown)"
                rows={6}
              />
            </div>
            <div>
              <Label htmlFor="xp_reward">XP Reward</Label>
              <Input
                id="xp_reward"
                type="number"
                value={lesson.xp_reward}
                onChange={(e) => setLesson({ ...lesson, xp_reward: Number.parseInt(e.target.value) || 0 })}
                placeholder="XP reward for completing this lesson"
              />
            </div>
          </CardContent>
        </Card>

        {/* Exercises */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Exercises</CardTitle>
                <CardDescription>Manage the exercises for this lesson</CardDescription>
              </div>
              <Button onClick={addExercise}>
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {lesson.exercises.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No exercises yet. Click "Add Exercise" to get started.
              </div>
            ) : (
              <div className="space-y-6">
                {lesson.exercises.map((exercise, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Exercise {index + 1}</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeExercise(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Exercise Type</Label>
                        <Select
                          value={exercise.type}
                          onValueChange={(value: any) => updateExercise(index, { type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                            <SelectItem value="fill_blank">Fill in the Blank</SelectItem>
                            <SelectItem value="case_study">Case Study</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Question</Label>
                        <Textarea
                          value={exercise.question}
                          onChange={(e) => updateExercise(index, { question: e.target.value })}
                          placeholder="Enter the exercise question"
                          rows={3}
                        />
                      </div>
                      {exercise.type === "multiple_choice" && (
                        <div>
                          <Label>Options</Label>
                          <div className="space-y-2">
                            {exercise.options?.map((option, optionIndex) => (
                              <Input
                                key={optionIndex}
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...(exercise.options || [])]
                                  newOptions[optionIndex] = e.target.value
                                  updateExercise(index, { options: newOptions })
                                }}
                                placeholder={`Option ${optionIndex + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      <div>
                        <Label>Correct Answer</Label>
                        <Input
                          value={exercise.correct_answer}
                          onChange={(e) => updateExercise(index, { correct_answer: e.target.value })}
                          placeholder="Enter the correct answer"
                        />
                      </div>
                      <div>
                        <Label>Explanation</Label>
                        <Textarea
                          value={exercise.explanation}
                          onChange={(e) => updateExercise(index, { explanation: e.target.value })}
                          placeholder="Explain why this is the correct answer"
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
