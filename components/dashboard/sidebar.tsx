"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { 
  X, 
  Home, 
  BookOpen, 
  Trophy, 
  Users, 
  Settings, 
  LogOut, 
  Sparkles, 
  Flame, 
  Crown, 
  Zap, 
  Brain,
  GraduationCap
} from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import { useEffect } from "react"

interface SidebarProps {
  user: any
  profile: any
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home, description: "Overview" },
  { name: "Learn", href: "/learn", icon: BookOpen, description: "Lessons" },
  { name: "AI Tutor", href: "/dashboard/ai-tutor", icon: Brain, description: "AI Assistance" },
  { name: "Achievements", href: "/achievements", icon: Trophy, description: "Progress" },
  { name: "Leaderboard", href: "/leaderboard", icon: Users, description: "Rankings" },
  { name: "Settings", href: "/settings", icon: Settings, description: "Account" },
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
      {/* Enhanced Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Reduced width from w-80 to w-64 and lg:w-72 to lg:w-60 */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-74 bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] shadow-xl transform transition-all duration-300 ease-in-out border-r border-[#E2E8F0]
        lg:translate-x-0 lg:static lg:inset-0 lg:w-65
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Compact Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0] bg-white/80 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-gradient-to-r from-[#6A0DAD] to-[#004AAD] rounded-lg shadow-md">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-[#6A0DAD]">Bloolabb</span>
                <span className="text-xs text-[#004AAD] font-medium block -mt-0.5">Learning Hub</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="lg:hidden rounded-lg h-8 w-8 p-0 hover:bg-[#6A0DAD]/10 transition-all duration-200"
            >
              <X className="h-4 w-4 text-[#6A0DAD]" />
            </Button>
          </div>

          {/* Compact User Profile Card */}
          <div className="p-3">
            <Card className="p-4 bg-gradient-to-br from-[#6A0DAD] via-[#004AAD] to-[#8B5FBF] text-white shadow-lg border-0 rounded-xl overflow-hidden relative group hover:shadow-xl transition-all duration-300">
              {/* Simplified background elements */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/5 rounded-full -translate-x-6 translate-y-6"></div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-md">
                      <div className="text-xl">👤</div>
                    </div>
                    {profile?.current_streak > 0 && (
                      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-1 shadow-lg">
                        <Flame className="h-2.5 w-2.5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate text-white mb-1">
                      {profile?.display_name || "New Learner"}
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm border border-white/20">
                        <Crown className="h-2.5 w-2.5 mr-1 text-amber-300" />
                        <span className="text-xs font-semibold">Level {userLevel}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compact Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs font-medium mb-2">
                    <span className="text-white/90">{currentLevelXp} XP</span>
                    <span className="text-white/90">{xpForNextLevel} XP</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-amber-400 to-amber-300 h-2 rounded-full shadow-sm transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Compact Stats Row */}
                <div className="flex justify-between space-x-2">
                  <div className="flex-1 text-center bg-white/15 rounded-lg p-2 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Sparkles className="h-3 w-3 text-purple-200" />
                      <span className="text-xs font-bold text-white">{profile?.total_xp || 0}</span>
                    </div>
                    <div className="text-[10px] text-white/80">Total XP</div>
                  </div>
                  <div className="flex-1 text-center bg-white/15 rounded-lg p-2 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Flame className="h-3 w-3 text-amber-400" />
                      <span className="text-xs font-bold text-white">{profile?.current_streak || 0}</span>
                    </div>
                    <div className="text-[10px] text-white/80">Day Streak</div>
                  </div>
                  <div className="flex-1 text-center bg-white/15 rounded-lg p-2 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <GraduationCap className="h-3 w-3 text-blue-300" />
                      <span className="text-xs font-bold text-white">{userLevel}</span>
                    </div>
                    <div className="text-[10px] text-white/80">Level</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Compact Language Selector */}
          <div className="px-3 mb-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 border border-[#E2E8F0] shadow-sm">
              <LanguageSelector />
            </div>
          </div>

          {/* Compact Navigation */}
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group relative
                    ${
                      isActive
                        ? "bg-white text-[#6A0DAD] shadow-md border border-[#6A0DAD]/15"
                        : "text-[#475569] hover:bg-white hover:text-[#6A0DAD] hover:shadow-sm hover:border hover:border-[#6A0DAD]/10 border border-transparent"
                    }
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-[#6A0DAD] to-[#004AAD] rounded-r-full"></div>
                  )}
                  
                  <div className={`
                    p-1.5 rounded-md transition-all duration-200
                    ${isActive 
                      ? "bg-gradient-to-r from-[#6A0DAD] to-[#004AAD] text-white shadow-sm" 
                      : "bg-[#F1F5F9] text-[#475569] group-hover:bg-gradient-to-r group-hover:from-[#6A0DAD] group-hover:to-[#004AAD] group-hover:text-white"
                    }
                  `}>
                    <Icon className={`h-4 w-4 transition-transform duration-200 ${
                      isActive ? "scale-105" : "group-hover:scale-105"
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm transition-colors duration-200">
                      {item.name}
                    </div>
                    <div className={`text-xs transition-all duration-200 ${
                      isActive ? "text-[#6A0DAD]/80" : "text-[#64748B] group-hover:text-[#6A0DAD]/80"
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Compact Sign Out */}
          <div className="p-4 border-t border-[#E2E8F0] bg-white/50 backdrop-blur-sm mt-auto">
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="w-full justify-start text-[#DC2626] hover:text-white hover:bg-gradient-to-r hover:from-[#DC2626] hover:to-[#EF4444] rounded-lg py-3 transition-all duration-200 group border border-[#FECACA] hover:border-transparent"
            >
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-[#FECACA] rounded-md group-hover:bg-white/20 transition-colors">
                  <LogOut className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </div>
                <span className="font-medium text-sm">Sign Out</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
