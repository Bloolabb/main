"use client"

import { Button } from "@/components/ui/button"

interface MultipleChoiceExerciseProps {
  exercise: any
  selectedAnswer: string
  onAnswer: (answer: string) => void
}

export function MultipleChoiceExercise({ exercise, selectedAnswer, onAnswer }: MultipleChoiceExerciseProps) {
  // Fix: Handle both stringified JSON and regular arrays
  const getOptions = () => {
    if (!exercise.options) return []
    
    try {
      // If it's already an array, return it
      if (Array.isArray(exercise.options)) {
        return exercise.options
      }
      
      // If it's a string, try to parse it
      if (typeof exercise.options === 'string') {
        // Remove extra escaping if present
        const cleanString = exercise.options.replace(/\\"/g, '"')
        return JSON.parse(cleanString)
      }
      
      return []
    } catch (error) {
      console.error('Error parsing options:', error)
      return []
    }
  }

  const options = getOptions()

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold text-gray-800 leading-relaxed">{exercise.question}</div>

      <div className="grid gap-3">
        {options.map((option: string, index: number) => (
          <Button
            key={index}
            onClick={() => onAnswer(option)}
            variant={selectedAnswer === option ? "default" : "outline"}
            className={`p-4 h-auto text-left justify-start text-wrap ${
              selectedAnswer === option
                ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                : "bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswer === option ? "border-white bg-white" : "border-gray-400"
                }`}
              >
                {selectedAnswer === option && <div className="w-3 h-3 bg-blue-500 rounded-full" />}
              </div>
              <span className="flex-1">{option}</span>
            </div>
          </Button>
        ))}
      </div>

      {exercise.explanation && selectedAnswer && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Explanation:</strong> {exercise.explanation}
          </div>
        </div>
      )}
    </div>
  )
}
