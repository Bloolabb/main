// case-study-exercise.tsx (Simplified)
"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CheckCircle, XCircle } from "lucide-react"
import { useState, useEffect } from "react"

interface CaseStudyExerciseProps {
  exercise: any
  selectedAnswer: string
  onAnswer: (answer: string) => void
  error?: string
}

export function CaseStudyExercise({ exercise, selectedAnswer, onAnswer, error }: CaseStudyExerciseProps) {
  const [showAnalysis, setShowAnalysis] = useState(false)
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

  const handleAnswer = (answer: string) => {
    onAnswer(answer)
    setShowAnalysis(true)
  }

  const isCorrect = selectedAnswer?.toLowerCase()?.trim() === exercise.correct_answer?.toLowerCase()?.trim()

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <strong>Error:</strong> {error}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-purple-50 p-6 rounded-xl border-2 border-purple-200"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-3 h-3 bg-purple-500 rounded-full" />
          <h3 className="text-lg font-semibold text-purple-800">Case Study</h3>
        </div>
        <div className="text-gray-700 leading-relaxed">
          {exercise.question}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-2 border-purple-100 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">What would you do?</h3>
        
        <div className="grid gap-3">
          {shuffledOptions.map((option: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                onClick={() => handleAnswer(option)}
                variant={selectedAnswer === option ? "default" : "outline"}
                className={`p-4 h-auto text-left justify-start w-full ${
                  selectedAnswer === option
                    ? "bg-purple-500 hover:bg-purple-600 text-white"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {option}
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {showAnalysis && selectedAnswer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-6 rounded-xl border-2 ${
            isCorrect ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"
          }`}
        >
          <div className="flex items-center space-x-3 mb-4">
            {isCorrect ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-orange-500" />
            )}
            <h4 className="text-lg font-semibold">
              {isCorrect ? "Great Choice!" : "Analysis"}
            </h4>
          </div>
          
          <div className="space-y-3">
            <div>
              <span className="font-medium">Your selection: </span>
              <span className={isCorrect ? "text-green-700" : "text-orange-700"}>
                {selectedAnswer}
              </span>
            </div>
            
            {!isCorrect && exercise.correct_answer && (
              <div>
                <span className="font-medium">Recommended approach: </span>
                <span className="text-green-700">{exercise.correct_answer}</span>
              </div>
            )}
            
            {exercise.explanation && (
              <div className="mt-4 p-4 bg-white rounded-lg border">
                <strong className="text-purple-700">Explanation:</strong>
                <p className="text-gray-700 mt-2">{exercise.explanation}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}