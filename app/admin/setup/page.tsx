"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminSetup() {
  const [email, setEmail] = useState("zvmmed@gmail.com")
  const [role, setRole] = useState("super_admin")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSetupAdmin = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      })

      const data = await response.json()
      setResult(data.message || data.error)
    } catch (error) {
      setResult("Error setting up admin user")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Setup</CardTitle>
          <CardDescription>Set up admin privileges for a user account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded-md">
              <option value="super_admin">Super Admin</option>
              <option value="content_admin">Content Admin</option>
              <option value="support_admin">Support Admin</option>
            </select>
          </div>

          <Button onClick={handleSetupAdmin} disabled={loading} className="w-full">
            {loading ? "Setting up..." : "Setup Admin"}
          </Button>

          {result && (
            <div
              className={`p-3 rounded-md text-sm ${
                result.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {result}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
