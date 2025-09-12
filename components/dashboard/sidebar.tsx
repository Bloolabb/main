"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { X, Home, BookOpen, Trophy, Users, Settings, LogOut, Sparkles, Flame } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import { useEffect } from "react"

interface SidebarProps {
  user: any
  profile: any
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Learn", href: "/learn", icon: BookOpen },
  { name: "Achievements", href: "/achievements", icon: Trophy },
  { name: "Leaderboard", href: "/leaderboard", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar({ user, profile, isOpen, onClose }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isOpen) {
      onClose()
    }
  }, [pathname])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#F4F4F9] shadow-xl transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#6A0DAD]/20">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-[#6A0DAD] to-[#004AAD] rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-[#6A0DAD]">AI Learning Hub</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="lg:hidden rounded-full h-8 w-8 p-0 hover:bg-[#6A0DAD]/10"
            >
              <X className="h-4 w-4 text-[#6A0DAD]" />
            </Button>
          </div>

          {/* User Profile Card */}
          <div className="p-4">
            <Card className="p-4 bg-gradient-to-r from-[#6A0DAD] to-[#004AAD] text-white shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="text-xl">👤</div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate text-white">
                    {profile?.display_name || "New Learner"}
                  </p>
                  <div className="flex items-center mt-2 space-x-3 text-xs font-medium">
                    <div className="flex items-center bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                      <Sparkles className="h-3 w-3 mr-1 text-white" />
                      <span>{profile?.total_xp || 0} XP</span>
                    </div>
                    <div className="flex items-center bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                      <Flame className="h-3 w-3 mr-1 text-white" />
                      <span>{profile?.current_streak || 0} days</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Language Selector */}
          <div className="px-4 mb-4">
            <LanguageSelector />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 mx-1
                    ${
                      isActive
                        ? "bg-white text-[#6A0DAD] shadow-md"
                        : "text-[#004AAD] hover:bg-white/50 hover:text-[#6A0DAD]"
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-[#6A0DAD]" : "text-[#004AAD]"}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Sign Out */}
          <div className="p-4 border-t border-[#6A0DAD]/20 mt-auto">
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="w-full justify-start text-[#FF6B00] hover:text-[#FF6B00] hover:bg-[#FF6B00]/10 rounded-xl py-3"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}