"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

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
  const [isFetchingContent, setIsFetchingContent] = useState(!lesson.description)
  const router = useRouter()
  const supabase = createClient()

  // Parse description and content from the lesson data
  // Format: "description text \n cnt: content text"
  // If no \n cnt: delimiter, entire text is treated as description (backward compatible)
  const parseDescriptionContent = (rawText: string) => {
    if (!rawText) return { description: "", content: "" }
    
    // Check if content delimiter exists
    const cntRegex = /\\n\s*cnt:\s*([\s\S]*)/i
    const cntMatch = rawText.match(cntRegex)
    
    if (cntMatch) {
      // Split: everything before \n cnt: is description, everything after is content
      const contentStartIndex = rawText.search(cntRegex)
      const description = rawText.substring(0, contentStartIndex).trim()
      const content = cntMatch[1].trim()
      
      return { description, content }
    }
    
    // No delimiter found - treat entire text as description (backward compatible)
    return { description: rawText.trim(), content: "" }
  }

  const { description, content } = parseDescriptionContent(lessonData.description || "")

  // Fetch complete lesson data if description is missing
  useEffect(() => {
    const fetchLessonContent = async () => {
      if (!lesson.description) {
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
  }, [lesson.id, lesson.description, supabase])

  const currentLessonIndex = allLessons.findIndex((l) => l.id === lessonData.id)
  const nextLesson = allLessons[currentLessonIndex + 1]
  const prevLesson = allLessons[currentLessonIndex - 1]

  const lessonSteps = [
    {
      type: "intro",
      title: "Getting Started",
      content: description || `Welcome to "${lessonData.title}"! Let's begin your learning journey.`,
      videoUrl: null,
    },
    {
      type: "content",
      title: lessonData.title,
      content: content || description || "",
      videoUrl: lessonData.youtube_url || null,
      isMainContent: true,
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
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <Button asChild variant="ghost" className="text-gray-600 hover:text-gray-800 -ml-2 sm:ml-0">
          <Link href={`/learn/${trackId}/${moduleId}`} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm sm:text-base">Back to Module</span>
          </Link>
        </Button>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
          <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="line-clamp-1">{lessonData.modules?.learning_tracks?.title || "Learning Track"}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs sm:text-sm">
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
        <CardHeader className="pb-3 sm:pb-4 border-b border-gray-100 px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl text-gray-900 wrap-break-word">
            {lessonSteps[currentStep].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {lessonSteps[currentStep].videoUrl && (
            <YouTubeVideo url={lessonSteps[currentStep].videoUrl} />
          )}
          {isFetchingContent && currentStep === 1 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm sm:text-base">Loading lesson content...</p>
            </div>
          ) : (
            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-700 leading-relaxed prose-headings:text-gray-900 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 wrap-break-word">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  // Custom rendering for better control
                  h1: ({node, ...props}) => <h1 className="text-2xl sm:text-3xl font-bold mt-6 mb-4" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl sm:text-2xl font-bold mt-5 mb-3" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-lg sm:text-xl font-semibold mt-4 mb-2" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2 ml-2 sm:ml-4" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2 ml-2 sm:ml-4" {...props} />,
                  li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                  a: ({node, ...props}) => <a className="text-blue-600 hover:text-blue-800 underline break-all" target="_blank" rel="noopener noreferrer" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                  em: ({node, ...props}) => <em className="italic" {...props} />,
                  code: ({node, inline, ...props}: any) => 
                    inline ? (
                      <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm" {...props} />
                    ) : (
                      <code className="block bg-gray-900 text-gray-100 p-3 sm:p-4 rounded-lg overflow-x-auto text-sm" {...props} />
                    ),
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-4" {...props} />
                  ),
                }}
              >
                {lessonSteps[currentStep].content}
              </ReactMarkdown>
            </div>
          )}
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

// Video Component - Supports YouTube and generic video embeds
function YouTubeVideo({ url }: { url: string }) {
  // Check if it's a YouTube URL
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  
  // Convert YouTube URL to embed format if needed
  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes('embed')) return url;
    
    // Handle various YouTube URL formats
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    const videoId = match ? match[1] : null;
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  // For non-YouTube URLs, use as-is (assumed to be embed URLs or video files)
  const embedUrl = isYouTube ? getYouTubeEmbedUrl(url) : url;

  return (
    <div className="mb-6">
      <div className="relative w-full pb-[56.25%] h-0 rounded-lg overflow-hidden bg-black">
        <iframe
          src={embedUrl}
          title="Video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full border-0"
        />
      </div>
    </div>
  )
}