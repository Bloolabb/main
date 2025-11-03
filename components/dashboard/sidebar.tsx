"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { 
  X, Home, BookOpen, Trophy, Users, Settings, LogOut, 
  Sparkles, Flame, Crown, Brain, GraduationCap,
  ChevronRight, Zap, Award, Target
} from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import { useEffect, useState } from "react"

interface SidebarProps {
  user: any
  profile: any
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home, description: "Your learning overview", badge: null },
  { name: "Learn", href: "/learn", icon: BookOpen, description: "Continue lessons", badge: "updated" },
  { name: "AI Tutor", href: "/ai-tutor", icon: Brain, description: "Get help instantly", badge: "beta" },
  { name: "Achievements", href: "/achievements", icon: Trophy, description: "Your progress", badge: null },
  { name: "Leaderboard", href: "/leaderboard", icon: Users, description: "See rankings", badge: null },
  { name: "Settings", href: "/settings", icon: Settings, description: "Account & preferences", badge: null },
]

export function Sidebar({ user, profile, isOpen, onClose }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (isOpen) onClose()
  }, [pathname])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const userLevel = profile?.total_xp ? Math.floor(profile.total_xp / 100) + 1 : 1
  const currentLevelXp = profile?.total_xp ? profile.total_xp % 100 : 0

  return (
    <div 
      className={`
        fixed lg:relative w-80 h-screen bg-white/95 backdrop-blur-md border-r border-gray-100
        flex flex-col shadow-xl z-50
        lg:bg-white lg:backdrop-blur-0 lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        transition-transform duration-300 ease-in-out
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Header Section - Fixed height */}
      <div className="shrink-0">
        {/* Brand Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg">Bloolabb</h1>
              <p className="text-xs text-gray-500">Learning Platform</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose} 
            className="lg:hidden h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* User Profile Card */}
        <div className="p-4">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-5 shadow-2xl border-0 overflow-hidden relative group cursor-pointer hover:shadow-2xl transition-all duration-300">
            
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full -translate-x-12 translate-y-12 group-hover:scale-110 transition-transform duration-700"></div>
            
            <div className="relative z-10">
              {/* User Info Row */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <div className="text-2xl">🎓</div>
                  </div>
                  {profile?.current_streak > 0 && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-1.5 shadow-lg animate-pulse">
                      <Flame className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate mb-1">
                    {profile?.display_name || "New Learner"}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
                      <Crown className="h-3.5 w-3.5 mr-1.5 text-amber-300" />
                      <span className="text-sm font-semibold">Level {userLevel}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Section */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">Progress to Level {userLevel + 1}</span>
                  <span className="font-semibold">{currentLevelXp}/100 XP</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2.5 backdrop-blur-sm overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-amber-400 to-amber-300 h-2.5 rounded-full shadow-sm transition-all duration-1000 ease-out"
                    style={{ width: `${(currentLevelXp / 100) * 100}%` }}
                  ></div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="text-center p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Zap className="h-3.5 w-3.5 text-amber-400" />
                      <span className="font-bold text-sm">{profile?.total_xp || 0}</span>
                    </div>
                    <div className="text-xs text-gray-300">Total XP</div>
                  </div>
                  <div className="text-center p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Flame className="h-3.5 w-3.5 text-orange-500" />
                      <span className="font-bold text-sm">{profile?.current_streak || 0}</span>
                    </div>
                    <div className="text-xs text-gray-300">Day Streak</div>
                  </div>
                  <div className="text-center p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Target className="h-3.5 w-3.5 text-blue-400" />
                      <span className="font-bold text-sm">{userLevel}</span>
                    </div>
                    <div className="text-xs text-gray-300">Level</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Scrollable Content Area - Takes remaining space */}
      <div className="flex-1 overflow-y-auto">
        {/* Language Selector */}
        {/* <div className="px-4 mb-6">
          <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-3 border border-gray-200 hover:border-gray-300 transition-colors">
            <LanguageSelector />
          </div>
        </div> */}

        {/* Navigation Section */}
        <nav className="px-3 space-y-1.5 pb-6">
          <div className="px-3 mb-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Navigation</h3>
          </div>
          
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 relative
                  ${isActive
                    ? "bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border border-purple-200 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm border border-transparent"
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    p-2 rounded-lg transition-all duration-200
                    ${isActive 
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-sm" 
                      : "bg-gray-100 text-gray-600 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:text-white"
                    }
                  `}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm transition-colors duration-200">
                        {item.name}
                      </span>
                      {item.badge && (
                        <span className={`
                          px-1.5 py-0.5 rounded-full text-xs font-medium
                          ${item.badge === 'beta' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                          }
                        `}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className={`text-xs transition-all duration-200 ${
                      isActive ? "text-purple-600/80" : "text-gray-500 group-hover:text-gray-700"
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </div>
                
                {/* Active indicator & hover arrow */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-purple-600 to-blue-600 rounded-r-full"></div>
                )}
                <ChevronRight className={`
                  h-4 w-4 transition-transform duration-200
                  ${isActive ? "text-purple-600" : "text-gray-400 group-hover:text-gray-600"}
                  group-hover:translate-x-0.5
                `} />
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer Section - Fixed at bottom */}
      <div className="shrink-0 border-t border-gray-200 bg-gray-50/50 backdrop-blur-sm">
          {/* <Button
            onClick={handleSignOut}
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:text-red-700 hover:bg-red-50 rounded-xl py-3 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-200 rounded-lg group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </div>
              <span className="font-medium text-sm">Sign Out</span>
            </div>
          </Button> */}
          
          {/* Version/Status */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500 p-2">
              <span>v2.1.0</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}