import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-2 border-red-200 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="text-6xl">😕</div>
            <CardTitle className="text-2xl font-bold text-red-600">Oops! Something went wrong</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {params?.error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">Error: {params.error}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">An unexpected error occurred during authentication.</p>
            )}

            <div className="space-y-2">
              <Button asChild className="w-full bg-red-500 hover:bg-red-600">
                <Link href="/auth/login">Try Again</Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-2 border-red-200 bg-transparent">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
