"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface MobileHeaderProps {
  profile: any
  onMenuClick: () => void
}

export function MobileHeader({ profile, onMenuClick }: MobileHeaderProps) {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between p-4">
        <Button variant="ghost" size="sm" onClick={onMenuClick}>
          <Menu className="h-6 w-6" />
        </Button>

        <div className="flex items-center space-x-2">
          <div className="text-xl">🎓</div>
          <span className="font-bold text-gray-800">Bloolabb hub</span>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <span className="text-blue-600 font-semibold">⚡ {profile?.total_xp || 0}</span>
          <span className="text-orange-600 font-semibold">🔥 {profile?.current_streak || 0}</span>
        </div>
      </div>
    </div>
  )
}
