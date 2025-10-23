"use client"

import { Button } from "@/components/ui/button"

interface CaseStudyExerciseProps {
  exercise: any
  selectedAnswer: string
  onAnswer: (answer: string) => void
}

export function CaseStudyExercise({ exercise, selectedAnswer, onAnswer }: CaseStudyExerciseProps) {
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
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-800 mb-3">Case Study</h3>
        <div className="text-gray-700 leading-relaxed">{exercise.question}</div>
      </div>

      <div className="space-y-2">
        <h4 className="text-lg font-semibold text-gray-800">What type of opportunity is this?</h4>
        <div className="grid gap-3">
          {options.map((option: string, index: number) => (
            <Button
              key={index}
              onClick={() => onAnswer(option)}
              variant={selectedAnswer === option ? "default" : "outline"}
              className={`p-4 h-auto text-left justify-start text-wrap ${
                selectedAnswer === option
                  ? "bg-purple-500 hover:bg-purple-600 text-white border-purple-500"
                  : "bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-purple-300"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === option ? "border-white bg-white" : "border-gray-400"
                  }`}
                >
                  {selectedAnswer === option && <div className="w-3 h-3 bg-purple-500 rounded-full" />}
                </div>
                <span className="flex-1">{option}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {exercise.explanation && selectedAnswer && (
        <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="text-sm text-purple-800">
            <strong>Analysis:</strong> {exercise.explanation}
          </div>
        </div>
      )}
    </div>
  )
}
