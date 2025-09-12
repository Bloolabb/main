import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-2 border-purple-200 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="text-6xl">📧</div>
            <CardTitle className="text-2xl font-bold text-purple-600">Check Your Email!</CardTitle>
            <CardDescription className="text-gray-600">We've sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              We've sent a confirmation email to your inbox. Click the link in the email to verify your account and
              start learning!
            </p>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                💡 <strong>Tip:</strong> Check your spam folder if you don't see the email in a few minutes.
              </p>
            </div>
            <Button asChild variant="outline" className="w-full border-2 border-purple-200 bg-transparent">
              <Link href="/auth/login">Back to Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
