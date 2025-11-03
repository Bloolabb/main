// fill-blank-exercise.tsx (Fixed space handling)
"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface FillBlankExerciseProps {
  exercise: any
  answer: string
  onAnswer: (answer: string) => void
}

export function FillBlankExercise({ exercise, answer, onAnswer }: FillBlankExerciseProps) {
  const [wordBank, setWordBank] = useState<string[]>([])
  const [blanks, setBlanks] = useState<string[]>([])
  const [draggedWord, setDraggedWord] = useState<string | null>(null)

  useEffect(() => {
    if (!exercise?.correct_answer) return

    // Parse correct answers and handle spaces properly
    const correctAnswers = exercise.correct_answer.split(';').map((ans: string) => 
      ans.trim() // Trim but keep original case for display
    )
    
    const baseWords = [
      ...correctAnswers,
      "ideas", "plans", "solutions", "thoughts", "concepts"
    ]
    
    const uniqueWords = [...new Set(baseWords)]
    setWordBank(uniqueWords.sort(() => Math.random() - 0.5))
    
    // Initialize blanks array
    const blankCount = (exercise?.question?.match(/______/g) || []).length
    setBlanks(Array(blankCount).fill(""))
    
    if (!answer) {
      onAnswer(Array(blankCount).fill("").join(';'))
    } else {
      // Parse existing answer
      const existingAnswers = answer.split(';').map(ans => ans.trim())
      setBlanks(existingAnswers)
    }
  }, [exercise?.correct_answer, answer, onAnswer])

  // Normalize answers for comparison (trim and lowercase)
  const normalizeAnswer = (ans: string) => ans.trim().toLowerCase()

  const handleDragStart = (word: string) => {
    setDraggedWord(word)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (!draggedWord) return

    const newBlanks = [...blanks]
    newBlanks[index] = draggedWord
    setBlanks(newBlanks)
    
    // Remove from word bank
    setWordBank(prev => prev.filter(w => w !== draggedWord))
    
    // Update parent - store original word but will compare normalized
    onAnswer(newBlanks.join(';'))
    setDraggedWord(null)
  }

  const handleRemoveFromBlank = (index: number) => {
    const word = blanks[index]
    if (!word) return

    const newBlanks = [...blanks]
    newBlanks[index] = ""
    setBlanks(newBlanks)
    
    // Add back to word bank
    setWordBank(prev => [...prev, word])
    onAnswer(newBlanks.join(';'))
  }

  // Get correct answers and normalize them for comparison
  const correctAnswers = exercise?.correct_answer 
    ? exercise.correct_answer.split(';').map((ans: string) => normalizeAnswer(ans))
    : []

  const isAnswerCorrect = (userAnswer: string, index: number) => {
    if (!userAnswer || !correctAnswers[index]) return false
    return normalizeAnswer(userAnswer) === correctAnswers[index]
  }

  const questionParts = exercise?.question?.split(/______/g) || [""]

  return (
    <div className="space-y-6">
      {/* Question with Drag & Drop Blanks */}
      <div className="text-xl font-semibold bg-orange-50 p-6 rounded-xl border-2 border-orange-100">
        <div className="flex flex-wrap items-center gap-2">
          {questionParts.map((part: string, index: number) => (
            <span key={index}>
              {part}
              {index < questionParts.length - 1 && (
                <div
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onClick={() => blanks[index] && handleRemoveFromBlank(index)}
                  className={`inline-block w-32 h-12 mx-2 border-2 rounded-lg text-center leading-10 cursor-pointer transition-all ${
                    blanks[index] 
                      ? isAnswerCorrect(blanks[index], index)
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-red-500 bg-red-50 text-red-700"
                      : "border-orange-300 bg-white border-dashed hover:border-orange-500"
                  }`}
                >
                  {blanks[index] || "Drop here"}
                </div>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Word Bank with Drag & Drop */}
      <div className="space-y-4">
        <div className="font-medium text-gray-700">Drag words to the blanks:</div>
        <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 min-h-[80px]">
          {wordBank.map((word) => (
            <motion.div
              key={word}
              draggable
              onDragStart={() => handleDragStart(word)}
              whileDrag={{ scale: 1.1 }}
              className="px-4 py-2 bg-white border-2 border-blue-200 rounded-lg cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-all"
            >
              {word}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-600 text-center">
        💡 Drag words from the bank to the blanks. Click on filled blanks to remove words.
      </div>

      {/* Explanation */}
      {exercise.explanation && blanks.every(blank => blank) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg"
        >
          <div className="text-yellow-800">
            <strong>Explanation:</strong> {exercise.explanation}
          </div>
        </motion.div>
      )}
    </div>
  )
}