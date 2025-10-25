"use client"

import type React from "react"
import { useState } from "react"
import { Sidebar } from "./sidebar"
import { MobileHeader } from "./mobile-header"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: any
  profile: any
}

export function DashboardLayout({ children, user, profile }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      {/* Mobile header */}
      <MobileHeader profile={profile} onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar user={user} profile={profile} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content with 20px left margin */}
        <main className="flex-1 p-2 lg:p-4 pt-16 lg:pt-4 min-w-0 ml-25 mr-22"> {/* Added ml-5 (20px) */}
          <div className="w-full max-w-none container mx-auto px-5">{children}</div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
    </div>
  )
}
