"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { X, Home, BookOpen, Trophy, Users, Settings, LogOut, Sparkles, Flame, Crown, Zap } from "lucide-react"
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

  // Calculate user level based on XP (example: 100 XP per level)
  const userLevel = profile?.total_xp ? Math.floor(profile.total_xp / 100) + 1 : 1
  const xpForNextLevel = userLevel * 100
  const currentLevelXp = profile?.total_xp ? profile.total_xp % 100 : 0
  const progressPercentage = (currentLevelXp / 100) * 100

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
              <span className="text-xl font-bold text-[#6A0DAD]">Bloolabb Hub</span>
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

          {/* Improved User Profile Card */}
          <div className="p-4">
            <Card className="p-5 bg-gradient-to-br from-[#6A0DAD] via-[#004AAD] to-[#8B5FBF] text-white shadow-xl border-0 rounded-2xl overflow-hidden relative">
              {/* Background pattern */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -translate-x-8 translate-y-8"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg">
                        <div className="text-2xl">👤</div>
                      </div>
                      {profile?.current_streak > 0 && (
                        <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-1 shadow-lg">
                          <Flame className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-lg truncate text-white mb-1">
                        {profile?.display_name || "New Learner"}
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm border border-white/20">
                          <Crown className="h-3 w-3 mr-1 text-amber-300" />
                          <span className="text-xs font-semibold">Level {userLevel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs font-medium mb-2">
                    <span className="text-white/90">{currentLevelXp} XP</span>
                    <span className="text-white/90">{xpForNextLevel} XP</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm">
                    <div 
                      className="bg-gradient-to-r from-amber-400 to-amber-300 h-2 rounded-full shadow-sm transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex justify-between space-x-2">
                  <div className="flex-1 text-center bg-white/15 rounded-xl p-2 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center justify-center space-x-1">
                      <Sparkles className="h-3 w-3 text-purple-200" />
                      <span className="text-xs font-bold text-white">{profile?.total_xp || 0}</span>
                    </div>
                    <div className="text-[10px] text-white/80 mt-1">Total XP</div>
                  </div>
                  <div className="flex-1 text-center bg-white/15 rounded-xl p-2 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center justify-center space-x-1">
                      <Flame className="h-3 w-3 text-amber-400" />
                      <span className="text-xs font-bold text-white">{profile?.current_streak || 0}</span>
                    </div>
                    <div className="text-[10px] text-white/80 mt-1">Day Streak</div>
                  </div>
                  <div className="flex-1 text-center bg-white/15 rounded-xl p-2 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center justify-center space-x-1">
                      <Zap className="h-3 w-3 text-blue-300" />
                      <span className="text-xs font-bold text-white">{userLevel}</span>
                    </div>
                    <div className="text-[10px] text-white/80 mt-1">Level</div>
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
                    flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 mx-1 group
                    ${
                      isActive
                        ? "bg-white text-[#6A0DAD] shadow-lg border border-[#6A0DAD]/10"
                        : "text-[#004AAD] hover:bg-white hover:text-[#6A0DAD] hover:shadow-md border border-transparent"
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 transition-transform duration-200 ${
                    isActive 
                      ? "text-[#6A0DAD] scale-110" 
                      : "text-[#004AAD] group-hover:scale-110"
                  }`} />
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
              className="w-full justify-start text-[#FF6B00] hover:text-[#FF6B00] hover:bg-[#FF6B00]/10 rounded-xl py-3 transition-all duration-200 group border border-transparent hover:border-[#FF6B00]/20"
            >
              <LogOut className="h-5 w-5 mr-3 transition-transform duration-200 group-hover:translate-x-1" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}