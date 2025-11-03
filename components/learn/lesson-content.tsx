"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface LessonContentProps {
  lesson: any
  userProgress: any
  allLessons: any[]
  trackId: string
  moduleId: string
  userId: string
}

export function LessonContent({ lesson, userProgress, allLessons, trackId, moduleId, userId }: LessonContentProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [lessonData, setLessonData] = useState(lesson)
  const [isFetchingContent, setIsFetchingContent] = useState(!lesson.description) // Changed to check description
  const router = useRouter()
  const supabase = createClient()

  // Fetch complete lesson data if description is missing
  useEffect(() => {
    const fetchLessonContent = async () => {
      if (!lesson.description) { // Changed to check description
        setIsFetchingContent(true)
        const { data, error } = await supabase
          .from("lessons")
          .select(`
            *,
            modules (
              learning_tracks (*)
            )
          `)
          .eq("id", lesson.id)
          .single()

        if (data && !error) {
          setLessonData(data)
        }
        setIsFetchingContent(false)
      }
    }

    fetchLessonContent()
  }, [lesson.id, lesson.description, supabase]) // Changed dependency to description

  const currentLessonIndex = allLessons.findIndex((l) => l.id === lessonData.id)
  const nextLesson = allLessons[currentLessonIndex + 1]
  const prevLesson = allLessons[currentLessonIndex - 1]

  const lessonSteps = [
    {
      type: "intro",
      title: "Getting Started",
      content: `Welcome to "${lessonData.title}"! ${lessonData.description + " Let's begin your learning journey."}`,
    },
    {
      type: "content",
      title: lessonData.title,
      content: lessonData.description ? ( // Changed to use description
        <div dangerouslySetInnerHTML={{ __html: lessonData.description }} />
      ) : isFetchingContent ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson content...</p>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-600">
          <p>No content available for this lesson.</p>
          <p className="text-sm mt-2">Please check back later or contact support.</p>
        </div>
      ),
      videoUrl: lessonData.youtube_url || null,
    },
    {
      type: "summary",
      title: "Ready to Practice",
      content: `Great work! You've completed the lesson content. Ready to test your knowledge with some exercises?`,
      videoUrl: null,
    },
  ]

  const handleNext = () => {
    if (currentStep < lessonSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsLoading(true)
      router.push(`/learn/${trackId}/${moduleId}/${lessonData.id}/exercises`)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progressPercent = ((currentStep + 1) / lessonSteps.length) * 100

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" className="text-gray-600 hover:text-gray-800">
          <Link href={`/learn/${trackId}/${moduleId}`} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Module</span>
          </Link>
        </Button>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BookOpen className="h-4 w-4" />
          <span>{lessonData.modules?.learning_tracks?.title || "Learning Track"}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700">Lesson Progress</span>
          <span className="text-gray-600">
            {currentStep + 1} of {lessonSteps.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-4 border-b border-gray-100">
          <CardTitle className="text-2xl text-gray-900">{lessonSteps[currentStep].title}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {lessonSteps[currentStep].videoUrl && (
            <YouTubeVideo url={lessonSteps[currentStep].videoUrl} />
          )}
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            {lessonSteps[currentStep].content}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          onClick={handlePrev}
          disabled={currentStep === 0}
          variant="outline"
          className="flex items-center gap-2 border-gray-300 text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="flex gap-1">
          {lessonSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                index <= currentStep ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          className="flex items-center gap-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 font-medium text-white"
          disabled={isLoading || (currentStep === 1 && isFetchingContent)}
        >
          <span>
            {currentStep === lessonSteps.length - 1 
              ? (isLoading ? "Loading..." : "Start Exercises") 
              : "Next"
            }
          </span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Lesson Navigation - Only show on the last step */}
      {currentStep === lessonSteps.length - 1 && (
        <div className="flex justify-between pt-6 border-t border-gray-200">
          {prevLesson ? (
            <Button asChild variant="outline" className="border-gray-300 text-gray-700">
              <Link href={`/learn/${trackId}/${moduleId}/${prevLesson.id}`}>
                ← {prevLesson.title}
              </Link>
            </Button>
          ) : (
            <div />
          )}

          {nextLesson ? (
            <Button asChild className="bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
              <Link href={`/learn/${trackId}/${moduleId}/${nextLesson.id}`}>
                {nextLesson.title} →
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="border-gray-300 text-gray-700">
              <Link href={`/learn/${trackId}/${moduleId}`}>Finish Module</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// YouTube Video Component
function YouTubeVideo({ url }: { url: string }) {
  // Convert YouTube URL to embed format if needed
  const getEmbedUrl = (url: string) => {
    if (url.includes('embed')) return url;
    
    // Handle various YouTube URL formats
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    const videoId = match ? match[1] : null;
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const embedUrl = getEmbedUrl(url);

  return (
    <div className="mb-6">
      <div className="relative w-full pb-[56.25%] h-0 rounded-lg overflow-hidden bg-black">
        <iframe
          src={embedUrl}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
    </div>
  )
}