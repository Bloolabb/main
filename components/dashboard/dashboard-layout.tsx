"use client"

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      {/* Animated background sparkles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400/40 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-300/30 rounded-full animate-pulse delay-700"></div>
      </div>

      <MobileHeader profile={profile} onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex relative">
        {/* Sidebar - Fixed/sticky on desktop, overlay on mobile */}
        <div className={`
          fixed inset-y-0 left-0 z-50 lg:z-30 lg:sticky lg:top-0 lg:h-screen
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <Sidebar 
            user={user} 
            profile={profile} 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8 min-w-0 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="min-h-[80vh]">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}