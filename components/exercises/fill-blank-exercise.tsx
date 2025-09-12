"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FillBlankExerciseProps {
  exercise: any
  answer: string
  onAnswer: (answer: string) => void
}

export function FillBlankExercise({ exercise, answer, onAnswer }: FillBlankExerciseProps) {
  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold text-gray-800 leading-relaxed">{exercise.question}</div>

      <div className="space-y-3">
        <Label htmlFor="answer" className="text-base font-medium text-gray-700">
          Your Answer:
        </Label>
        <Input
          id="answer"
          type="text"
          placeholder="Type your answer here..."
          value={answer || ""}
          onChange={(e) => onAnswer(e.target.value)}
          className="h-12 text-lg border-2 border-gray-200 focus:border-blue-400"
        />
      </div>

      {exercise.explanation && answer && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Hint:</strong> {exercise.explanation}
          </div>
        </div>
      )}
    </div>
  )
}
