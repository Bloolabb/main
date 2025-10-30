"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { 
  LogOut, 
  Save, 
  User, 
  Mail, 
  Shield, 
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Download,
  Trash2,
  Key,
  Loader2,
  Upload,
  Image
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

interface SettingsFormProps {
  user: any
  profile: any
}

export function SettingsForm({ user, profile }: SettingsFormProps) {
  const [activeTab, setActiveTab] = useState("profile")
  const [displayName, setDisplayName] = useState(profile?.display_name || "")
  const [username, setUsername] = useState(profile?.username || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  // Initialize form data when profile changes
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "")
      setUsername(profile.username || "")
      setBio(profile.bio || "")
      setAvatarUrl(profile.avatar_url || "")
    }
  }, [profile])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const updates = {
        display_name: displayName,
        username: username,
        bio: bio,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
        action: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      })
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Error updating profile. Please try again.",
        variant: "destructive",
        action: <AlertCircle className="h-4 w-4" />,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    setIsLoading(true)

    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error("New passwords don't match")
      }

      if (passwordData.newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters long")
      }

      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })

      if (error) throw error

      toast({
        title: "Password updated!",
        description: "Your password has been changed successfully.",
        action: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      })
      
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
      setShowPasswordDialog(false)
    } catch (error: any) {
      toast({
        title: "Password change failed",
        description: error.message || "Error changing password. Please try again.",
        variant: "destructive",
        action: <AlertCircle className="h-4 w-4" />,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return

      const file = event.target.files[0]
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      if (!validTypes.includes(file.type)) {
        throw new Error('Please select a valid image file (JPEG, PNG, or GIF)')
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB')
      }

      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}-${Date.now()}.${fileExt}`

      setIsUploading(true)
      setUploadProgress(0)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      clearInterval(progressInterval)

      if (uploadError) throw uploadError

      setUploadProgress(100)

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setAvatarUrl(publicUrl)

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      toast({
        title: "Avatar updated!",
        description: "Your profile picture has been updated successfully.",
        action: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      })
      router.refresh()

      // Reset progress after success
      setTimeout(() => setUploadProgress(0), 1000)
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Error uploading avatar. Please try again.",
        variant: "destructive",
        action: <AlertCircle className="h-4 w-4" />,
      })
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveAvatar = async () => {
    try {
      setIsUploading(true)
      
      // Remove avatar URL from profile
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id)

      if (error) throw error

      setAvatarUrl("")
      
      toast({
        title: "Avatar removed!",
        description: "Your profile picture has been removed successfully.",
        action: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      })
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Remove failed",
        description: error.message || "Error removing avatar. Please try again.",
        variant: "destructive",
        action: <AlertCircle className="h-4 w-4" />,
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleExportData = async () => {
    setIsExporting(true)
    try {
      // Fetch user data
      const [progressData, badgesData] = await Promise.all([
        supabase.from("user_progress").select("*").eq("user_id", user.id),
        supabase.from("user_badges").select("*, badges(*)").eq("user_id", user.id)
      ])

      const exportData = {
        exportedAt: new Date().toISOString(),
        user: {
          email: user.email,
          profile: profile
        },
        progress: progressData.data,
        badges: badgesData.data
      }

      // Create and download file
      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `learnly-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Data exported!",
        description: "Your learning data has been exported successfully.",
        action: <Download className="h-4 w-4 text-green-500" />,
      })
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message || "Error exporting data. Please try again.",
        variant: "destructive",
        action: <AlertCircle className="h-4 w-4" />,
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleResetProgress = async () => {
    setIsLoading(true)
    try {
      // Reset user progress
      await supabase.from("user_progress").delete().eq("user_id", user.id)
      await supabase.from("user_badges").delete().eq("user_id", user.id)
      await supabase
        .from("profiles")
        .update({
          total_xp: 0,
          current_streak: 0,
          longest_streak: 0,
          last_activity_date: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      toast({
        title: "Progress reset!",
        description: "All your learning progress has been reset successfully.",
        action: <RotateCcw className="h-4 w-4 text-green-500" />,
      })
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.message || "Error resetting progress. Please try again.",
        variant: "destructive",
        action: <AlertCircle className="h-4 w-4" />,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    toast({
      title: "Signed out successfully",
      description: "Hope to see you again soon!",
    })
  }

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || "U"
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50/30 py-8 px-4">
      <div className="mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Account Settings
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Manage your profile, preferences, and account security in one place
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <Card className="lg:col-span-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-gray-100">
                <Avatar className="h-20 w-20 mb-4 ring-4 ring-white shadow-lg">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-lg bg-linear-to-br from-blue-500 to-purple-600 text-white">
                    {getInitials(displayName || user.email)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="font-semibold text-gray-900 truncate w-full">
                  {displayName || "Anonymous Learner"}
                </h2>
                <p className="text-sm text-gray-500 truncate w-full">{user.email}</p>
                <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-700">
                  {profile?.total_xp || 0} XP
                </Badge>
              </div>

              <nav className="space-y-2">
                {[
                  { id: "profile", label: "Profile", icon: User },
                  { id: "account", label: "Account", icon: Shield },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === item.id
                        ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4 border-b border-gray-100">
                  <CardTitle className="flex items-center space-x-3 text-2xl text-gray-900">
                    <User className="h-6 w-6 text-blue-600" />
                    <span>Profile Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    {/* Avatar Upload */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 bg-gray-50 rounded-xl">
                      <div className="relative">
                        <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
                          <AvatarImage src={avatarUrl} />
                          <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white">
                            {getInitials(displayName || user.email)}
                          </AvatarFallback>
                        </Avatar>
                        {isUploading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                            <Loader2 className="h-6 w-6 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-3">
                        <Label className="text-sm font-medium text-gray-700">
                          Profile Picture
                        </Label>
                        
                        {isUploading && uploadProgress > 0 && (
                          <div className="space-y-2">
                            <Progress value={uploadProgress} className="h-2" />
                            <p className="text-xs text-gray-500">Uploading... {uploadProgress}%</p>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Label htmlFor="avatar-upload" className="cursor-block">
                            <Input
                              id="avatar-upload"
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/gif"
                              onChange={handleAvatarUpload}
                              className="hidden"
                              disabled={isUploading}
                            />
                            <Button disabled
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              // disabled={isUploading}
                              className="flex items-center gap-2"
                            >
                              {isUploading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Upload className="h-4 w-4" />
                              )}
                              {isUploading ? "Uploading..." : "Upload New"}
                            </Button>
                          </Label>
                          
                          {avatarUrl && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  disabled={isUploading}
                                  className="flex items-center gap-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Remove
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove Profile Picture?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will remove your current profile picture. You can upload a new one at any time.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleRemoveAvatar}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Remove Picture
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          JPG, PNG or GIF. Max 5MB.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="displayName" className="text-sm font-medium text-gray-700">
                          Display Name *
                        </Label>
                        <Input
                          id="displayName"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Enter your display name"
                          className="h-12 border-2 border-gray-200 focus:border-blue-400 transition-colors"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                          Username
                        </Label>
                        <Input disabled
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Choose a username"
                          className="h-12 border-2 border-gray-200 focus:border-blue-400 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                        Bio
                      </Label>
                      <textarea disabled
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us a bit about yourself..."
                        rows={4}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-0 resize-none transition-colors"
                      />
                      <p className="text-xs text-gray-500">
                        {bio.length}/200 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address
                      </Label>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={user.email}
                          disabled
                          className="border-0 bg-transparent p-0 text-gray-600 focus-visible:ring-0"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Contact support to change your email address
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:w-auto bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {isLoading ? "Saving Changes..." : "Save Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Account Tab */}
            {activeTab === "account" && (
              <div className="space-y-6">
                {/* Password Change */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4 border-b border-gray-100">
                    <CardTitle className="flex items-center space-x-3 text-2xl text-gray-900">
                      <Key className="h-6 w-6 text-blue-600" />
                      <span>Change Password</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                          Current Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="h-12 border-2 border-gray-200 focus:border-blue-400 pr-10"
                            placeholder="Enter your current password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-600 hover:text-gray-800"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                            New Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                              className="h-12 border-2 border-gray-200 focus:border-blue-400 pr-10"
                              placeholder="Enter new password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-600 hover:text-gray-800"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                            Confirm Password
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="h-12 border-2 border-gray-200 focus:border-blue-400"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>

                      <AlertDialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                        <AlertDialogTrigger asChild>
                          <Button
                            disabled={!passwordData.newPassword || !passwordData.confirmPassword || isLoading}
                            className="bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                          >
                            <Key className="h-4 w-4 mr-2" />
                            Update Password
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Change Password?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to change your password? You will need to use your new password to sign in next time.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handlePasswordChange}
                              disabled={isLoading}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Updating...
                                </>
                              ) : (
                                'Change Password'
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </form>
                  </CardContent>
                </Card>

                {/* Data Management */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4 border-b border-gray-100">
                    <CardTitle className="text-2xl text-gray-900">
                      Data Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Export Data */}
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-800 flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Export Your Data
                        </h3>
                        <p className="text-sm text-green-700 mt-1">
                          Download all your learning progress, achievements, and profile data
                        </p>
                      </div>
                      <Button
                        onClick={handleExportData}
                        disabled={isExporting}
                        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                      >
                        {isExporting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        {isExporting ? "Exporting..." : "Export Data"}
                      </Button>
                    </div>

                    {/* Reset Progress */}
                    <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <div className="flex-1">
                        <h3 className="font-semibold text-amber-800 flex items-center gap-2">
                          <RotateCcw className="h-4 w-4" />
                          Reset Learning Progress
                        </h3>
                        <p className="text-sm text-amber-700 mt-1">
                          Clear all your progress, XP, streaks, and start fresh. This cannot be undone.
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                            Reset Progress
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reset All Progress?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete all your learning progress, achievements, XP, and streaks. 
                              This action cannot be undone. Make sure to export your data first if you want to keep a backup.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleResetProgress}
                              className="bg-amber-600 hover:bg-amber-700 flex items-center gap-2"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <RotateCcw className="h-4 w-4" />
                              )}
                              {isLoading ? "Resetting..." : "Yes, Reset Everything"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    {/* Delete Account */}
                    <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex-1">
                        <h3 className="font-semibold text-red-800 flex items-center gap-2">
                          <Trash2 className="h-4 w-4" />
                          Delete Account
                        </h3>
                        <p className="text-sm text-red-700 mt-1">
                          Permanently delete your account and all associated data. This action is irreversible.
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                            Delete Account
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Your Account?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete your account, all learning progress, achievements, and personal data. 
                              This action cannot be undone. Please be certain.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                              Yes, Delete Account
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>

                {/* Sign Out */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">Sign Out</h3>
                        <p className="text-sm text-gray-600">Sign out of your account on this device</p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Sign Out?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to sign out? You'll need to sign in again to access your account.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleSignOut}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Yes, Sign Out
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}