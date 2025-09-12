import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Access Denied</CardTitle>
            <CardDescription className="text-slate-300">
              You don't have permission to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-400 text-sm">This area is restricted to authorized administrators only.</p>
            <div className="space-y-2">
              <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <Link href="/">Return to bloolabb</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
              >
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
