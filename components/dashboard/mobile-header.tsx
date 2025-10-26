"use client"

import { Button } from "@/components/ui/button"
import { Menu, Sparkles, Flame, Zap } from "lucide-react"

interface MobileHeaderProps {
  profile: any
  onMenuClick: () => void
}

export function MobileHeader({ profile, onMenuClick }: MobileHeaderProps) {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-700/60 shadow-sm">
      <div className="flex items-center justify-between p-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onMenuClick}
          className="rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
        >
          <Menu className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-400 rounded-full border border-white"></div>
          </div>
          <div>
            <span className="font-bold text-gray-900 dark:text-white text-sm">Bloolabb</span>
            <span className="text-xs text-purple-600 dark:text-purple-400 block -mt-0.5">Hub</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 px-3 py-1.5 rounded-full border border-purple-200 dark:border-purple-800">
            <Zap className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span className="font-bold text-purple-700 dark:text-purple-300 text-sm">{profile?.total_xp || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500/10 to-red-500/10 px-3 py-1.5 rounded-full border border-orange-200 dark:border-orange-800">
            <Flame className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
            <span className="font-bold text-orange-700 dark:text-orange-300 text-sm">{profile?.current_streak || 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}