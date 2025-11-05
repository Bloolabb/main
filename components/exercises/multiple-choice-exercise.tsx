// multiple-choice-exercise.tsx (Simplified)
"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CheckCircle, XCircle } from "lucide-react"
import { useState, useEffect } from "react"

interface MultipleChoiceExerciseProps {
  exercise: any
  selectedAnswer: string
  onAnswer: (answer: string) => void
}

export function MultipleChoiceExercise({ exercise, selectedAnswer, onAnswer }: MultipleChoiceExerciseProps) {
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([])

  useEffect(() => {
    // Parse and shuffle options whenever exercise changes
    const options = Array.isArray(exercise.options) 
      ? exercise.options 
      : typeof exercise.options === 'string' 
        ? JSON.parse(exercise.options.replace(/\\"/g, '"'))
        : []

    // Shuffle the options array
    const shuffled = [...options].sort(() => Math.random() - 0.5)
    setShuffledOptions(shuffled)
  }, [exercise.options])

  const isCorrect = (option: string) => 
    selectedAnswer?.toLowerCase()?.trim() === exercise.correct_answer?.toLowerCase()?.trim()

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-semibold bg-blue-50 p-6 rounded-xl border-2 border-blue-100"
      >
        {exercise.question}
      </motion.div>

      <div className="grid gap-3">
        {shuffledOptions.map((option: string, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              onClick={() => onAnswer(option)}
              variant={selectedAnswer === option ? "default" : "outline"}
              className={`p-4 h-auto text-left justify-start w-full ${
                selectedAnswer === option
                  ? isCorrect(option)
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3 w-full">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswer === option ? "border-white" : "border-gray-400"
                }`}>
                  {selectedAnswer === option && (
                    isCorrect(option) ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />
                  )}
                </div>
                <span className="flex-1">{option}</span>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>

      {exercise.explanation && selectedAnswer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl"
        >
          <div className="text-blue-800 font-medium mb-2">Explanation:</div>
          <div className="text-blue-700">{exercise.explanation}</div>
        </motion.div>
      )}
    </div>
  )
}