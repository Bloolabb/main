import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AITutors } from "@/components/ai-tutor/ai-tutor"
import { redirect } from "next/navigation"
import { Brain, Zap, Sparkles, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"

export default async function AITutorPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  return (
    <DashboardLayout user={data.user} profile={profile}>
      <div className="">
        {/* Clean Header */}
        <div className="text-center">
          {/* Hero Section matching the image */}
          <div className="relative w-full mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg px-8 py-10">
            {/* Background decoration images */}
            <img
              alt="triangle"
              className="z-0 absolute top-8 left-8 w-16 h-16 opacity-20"
              src="https://ai-tutor.ai/images/bg/learn-triangle.svg"
            />
            <img
              alt="star"
              className="z-0 absolute bottom-8 right-8 w-16 h-16 opacity-20"
              src="https://ai-tutor.ai/images/bg/learn-star.svg"
            />
            
            <div className="space-y-6 z-10 relative">
              <h2 className="text-center text-2xl sm:text-3xl font-medium leading-tight">
                With 🧠 AI Tutor, you learn at your own pace <br />
                through bite-sized, practical education.
              </h2>
              
              <div className="flex justify-center">
                <a 
                  href="/learn" 
                  className="inline-flex items-center gap-2 text-white hover:text-blue-100 font-medium transition-colors"
                >
                  View Other Courses <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <br />
        {/* AI Tutors Component */}
        <AITutors />
       {/* First Time User Guide */}

        <Card className="border-2 border-blue-200 bg-blue-50 my-8">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-5 w-5 text-blue-500" />
              <div className="text-sm text-blue-700">
                <strong>Tip:</strong> You have 5 hearts a today. Each question uses 1 heart. Hearts reset daily!
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Simple AI Features Section */}
        <div className="bg-gray-50 rounded-xl p-6 border">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold">How AI Tutor Helps You Learn</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-500" />
                <span className="font-medium">Well Thought Answers</span>
              </div>
              <p className="text-gray-600">
                Get immediate explanations for any concept
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-blue-500" />
                <span className="font-medium">Personalized Help</span>
              </div>
              <p className="text-gray-600">
                Tailored explanations based on your progress
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="font-medium">24/7 Available</span>
              </div>
              <p className="text-gray-600">
                Learn anytime with our AI assistant
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}