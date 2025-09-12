"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { X, CheckCircle, Lock } from "lucide-react"

interface BadgeModalProps {
  badge: any
  isEarned: boolean
  progress: number
  onClose: () => void
}

export function BadgeModal({ badge, isEarned, progress, onClose }: BadgeModalProps) {
  const getConditionText = () => {
    switch (badge.condition_type) {
      case "xp_milestone":
        return `Earn ${badge.condition_value} XP`
      case "streak":
        return `Maintain a ${badge.condition_value}-day learning streak`
      case "lessons_completed":
        return `Complete ${badge.condition_value} lessons`
      case "track_completed":
        return "Complete an entire learning track"
      default:
        return "Meet the requirements"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-2 border-gray-200 shadow-2xl">
        <CardHeader
          className={`text-center ${isEarned ? "bg-gradient-to-r from-yellow-400 to-orange-500" : "bg-gradient-to-r from-gray-400 to-gray-600"} text-white`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-6xl mb-4">{badge.icon}</div>
          <CardTitle className="text-2xl font-bold">{badge.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-gray-700 text-center leading-relaxed">{badge.description}</p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Requirement:</span>
              <span className="font-medium text-gray-800">{getConditionText()}</span>
            </div>

            {isEarned ? (
              <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Badge Earned!</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress:</span>
                  <span className="font-medium text-gray-800">{Math.round(progress * 100)}%</span>
                </div>
                <Progress value={progress * 100} className="h-3" />
                <div className="flex items-center justify-center space-x-2 text-gray-500 bg-gray-50 p-3 rounded-lg">
                  <Lock className="h-4 w-4" />
                  <span className="text-sm">Keep learning to unlock this badge!</span>
                </div>
              </div>
            )}
          </div>

          <Button onClick={onClose} className="w-full bg-blue-500 hover:bg-blue-600">
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
