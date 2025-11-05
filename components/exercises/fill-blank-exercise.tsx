// fill-blank-exercise.tsx
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Lightbulb, Sparkles, RotateCcw } from "lucide-react"
import { useState, useEffect } from "react"

interface FillBlankExerciseProps {
  exercise: any
  answer: string
  onAnswer: (answer: string) => void
}

// Word categories for variety
const WORD_CATEGORIES = {
  business: ["strategy", "market", "profit", "customer", "product", "service", "brand", "growth"],
  innovation: ["creative", "unique", "novel", "original", "breakthrough", "disruptive", "pioneer"],
  problemSolving: ["solution", "resolve", "fix", "address", "tackle", "overcome", "resolve"],
  general: ["develop", "create", "build", "design", "implement", "execute", "launch"],
  ai: ["artificial", "intelligence", "machine", "learning", "neural", "network", "algorithm"]
}

export function FillBlankExercise({ exercise, answer, onAnswer }: FillBlankExerciseProps) {
  const [wordBank, setWordBank] = useState<string[]>([])
  const [blanks, setBlanks] = useState<string[]>([])
  const [draggedWord, setDraggedWord] = useState<string | null>(null)
  const [attemptUsed, setAttemptUsed] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [initialized, setInitialized] = useState(false)

  // Generate stable word bank - only once per exercise
  const generateWordBank = () => {
    if (!exercise?.correct_answer) return []
    
    const correctAnswers = exercise.correct_answer.split(';').map((ans: string) => ans.trim())
    const randomWordCount = Math.max(4, 6 - correctAnswers.length)
    
    // Get all available words
    const allWords = [
      ...WORD_CATEGORIES.business,
      ...WORD_CATEGORIES.innovation,
      ...WORD_CATEGORIES.problemSolving,
      ...WORD_CATEGORIES.general,
      ...WORD_CATEGORIES.ai
    ]
    
    // Filter out correct answers and shuffle
    const availableWords = allWords.filter(word => 
      !correctAnswers.some(correct => correct.toLowerCase() === word.toLowerCase())
    )
    
    const shuffledAvailable = [...availableWords].sort(() => Math.random() - 0.5)
    const selectedRandomWords = shuffledAvailable.slice(0, randomWordCount)
    
    // Combine and shuffle final word bank
    const finalWords = [...correctAnswers, ...selectedRandomWords]
    return [...new Set(finalWords)].sort(() => Math.random() - 0.5)
  }

  useEffect(() => {
    if (!exercise?.correct_answer || initialized) return

    const blankCount = (exercise?.question?.match(/_______/g) || []).length
    const wordBankData = generateWordBank()
    
    setWordBank(wordBankData)
    
    if (!answer) {
      // Initialize empty blanks
      const initialBlanks = Array(blankCount).fill("")
      setBlanks(initialBlanks)
      onAnswer(initialBlanks.join(';'))
    } else {
      // Restore from existing answer
      const existingAnswers = answer.split(';').map(ans => ans.trim())
      setBlanks(existingAnswers)
      
      // Only mark attempt as used if ALL blanks are filled
      if (existingAnswers.every(ans => ans.trim() !== "")) {
        setAttemptUsed(true)
        // Remove used words from word bank
        const remainingWords = wordBankData.filter(word => !existingAnswers.includes(word))
        setWordBank(remainingWords)
      }
    }
    
    setInitialized(true)
  }, [exercise?.correct_answer, answer, onAnswer, initialized])

  // Normalize answers for comparison
  const normalizeAnswer = (ans: string) => ans.trim().toLowerCase()

  const handleDragStart = (word: string) => {
    if (attemptUsed) return
    setDraggedWord(word)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (!draggedWord || attemptUsed) return

    const newBlanks = [...blanks]
    newBlanks[index] = draggedWord
    setBlanks(newBlanks)
    
    // Remove the used word from word bank
    setWordBank(prev => prev.filter(w => w !== draggedWord))
    onAnswer(newBlanks.join(';'))
    setDraggedWord(null)
    
    // Only mark attempt as used when ALL blanks are filled
    const allFilled = newBlanks.every(blank => blank.trim() !== "")
    if (allFilled) {
      setAttemptUsed(true)
    }
  }

  const handleRemoveFromBlank = (index: number) => {
    if (attemptUsed) return
    
    const word = blanks[index]
    if (!word) return

    const newBlanks = [...blanks]
    newBlanks[index] = ""
    setBlanks(newBlanks)
    
    // Add the word back to word bank
    setWordBank(prev => [...prev, word])
    onAnswer(newBlanks.join(';'))
    
    // If removing a word, allow further attempts
    setAttemptUsed(false)
  }

  const handleReset = () => {
    // Regenerate fresh word bank
    const freshWordBank = generateWordBank()
    const blankCount = (exercise?.question?.match(/_______/g) || []).length
    
    setWordBank(freshWordBank)
    setBlanks(Array(blankCount).fill(""))
    setAttemptUsed(false)
    setShowHint(false)
    setDraggedWord(null)
    onAnswer(Array(blankCount).fill("").join(';'))
  }

  // Get correct answers
  const correctAnswers = exercise?.correct_answer 
    ? exercise.correct_answer.split(';').map((ans: string) => normalizeAnswer(ans))
    : []

  const isAnswerCorrect = (userAnswer: string, index: number) => {
    if (!userAnswer || !correctAnswers[index]) return false
    return normalizeAnswer(userAnswer) === correctAnswers[index]
  }

  const isAllCorrect = blanks.every((blank, index) => isAnswerCorrect(blank, index))
  const isComplete = blanks.every(blank => blank.trim() !== "")
  const blankCount = (exercise?.question?.match(/_______/g) || []).length
  const questionParts = exercise?.question?.split(/_______/g) || [""]

  return (
    <div className="space-y-6">
      {/* One Attempt Warning - Only show when ALL blanks are filled */}
      {attemptUsed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg text-center"
        >
          <div className="text-blue-700 font-medium">
            ⚠️ All blanks filled! Use reset to try again.
          </div>
        </motion.div>
      )}

      {/* Question with Drag & Drop Blanks */}
      <div className="text-xl font-semibold bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-xl border-2 border-orange-100">
        <div className="flex flex-wrap items-center gap-2">
          {questionParts.map((part: string, index: number) => (
            <span key={index}>
              {part}
              {index < questionParts.length - 1 && (
                <div
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onClick={() => blanks[index] && handleRemoveFromBlank(index)}
                  className={`inline-flex items-center justify-center min-w-32 mx-2 px-3 py-2 border-2 rounded-lg transition-all ${
                    attemptUsed 
                      ? isAnswerCorrect(blanks[index], index)
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-red-500 bg-red-50 text-red-700"
                      : blanks[index] 
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-orange-300 bg-white border-dashed hover:border-orange-500"
                  } ${attemptUsed ? 'cursor-default' : 'cursor-pointer'} ${
                    blanks[index] ? 'h-auto' : 'h-12'
                  }`}
                >
                  {blanks[index] ? (
                    <span className="text-lg font-medium whitespace-nowrap">
                      {blanks[index]}
                    </span>
                  ) : (
                    <span className="text-gray-500">Drop here</span>
                  )}
                </div>
              )}
            </span>
          ))}
        </div>

        {/* Blank Indicators for multiple blanks */}
        {blankCount > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: blankCount }).map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  blanks[index] 
                    ? attemptUsed
                      ? isAnswerCorrect(blanks[index], index)
                        ? "bg-green-500"
                        : "bg-red-500"
                      : "bg-blue-500"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Word Bank */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-base font-medium text-gray-700">
          <Sparkles className="h-4 w-4" />
          <span>Drag words to the blanks:</span>
          {attemptUsed && <span className="text-red-500 ml-2">(Locked)</span>}
        </div>
        
        <div className={`flex flex-wrap gap-3 p-4 rounded-xl border-2 border-dashed min-h-[80px] ${
          attemptUsed ? 'bg-gray-100 border-gray-300' : 'bg-gray-50 border-gray-200'
        }`}>
          {wordBank.map((word) => (
            <motion.div
              key={word}
              draggable={!attemptUsed}
              onDragStart={() => handleDragStart(word)}
              whileHover={!attemptUsed ? { scale: 1.05 } : {}}
              whileDrag={{ scale: 1.1 }}
              className={`px-4 py-2 rounded-lg border-2 shadow-sm transition-all ${
                attemptUsed
                  ? 'bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-white border-blue-200 text-blue-700 cursor-grab active:cursor-grabbing hover:shadow-md hover:bg-blue-50'
              }`}
            >
              {word}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-600 text-center">
        💡 Drag words from the bank to the blanks. {!attemptUsed && "Click on filled blanks to remove words."}
        {blankCount > 1 && (
          <div className="mt-1 text-blue-600">
            Fill all {blankCount} blanks to submit your answer
          </div>
        )}
      </div>

      {/* Hint System */}
      <div className="space-y-4">
        <Button
          onClick={() => setShowHint(!showHint)}
          variant="outline"
          className="flex items-center gap-2 bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
        >
          <Lightbulb className="h-4 w-4" />
          <span>{showHint ? "Hide Hint" : "Show Hint"}</span>
        </Button>

        <AnimatePresence>
          {showHint && exercise?.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg overflow-hidden"
            >
              <div className="text-sm text-yellow-800">
                <strong>Hint:</strong> {exercise.explanation}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reset Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleReset}
          variant="outline"
          className="flex items-center gap-2 bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset and Try Again</span>
        </Button>
      </div>

      {/* Success/Failure Message - Only show when ALL blanks are filled */}
      <AnimatePresence>
        {attemptUsed && isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-lg text-center ${
              isAllCorrect 
                ? 'bg-green-500 text-white' 
                : 'bg-red-50 border-2 border-red-200 text-red-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2 font-semibold">
              <Sparkles className="h-5 w-5" />
              <span>
                {isAllCorrect 
                  ? `🎯 ${blankCount === 1 ? "Perfect answer!" : "All answers correct!"}` 
                  : "❌ Some answers are incorrect. Use reset to try again."}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explanation */}
      <AnimatePresence>
        {attemptUsed && isAllCorrect && exercise.explanation && (
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
      </AnimatePresence>
    </div>
  )
}