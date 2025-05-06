"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string;
    };
  }
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    username: "",
    bio: "",
    totalParasRead: 0,
    khatmsParticipated: 0,
    readingStreak: 0,
    achievements: 0,
    isEditing: false,
    emailNotifications: true,
    language: "English"
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")
  const [recentCompletions, setRecentCompletions] = useState<Array<{
    paraNumber: number;
    rukuNumber: number | null;
    completedAt: string;
  }>>([])

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in")
    }
  }, [status, router])

  // Fetch user profile data
  useEffect(() => {
    async function fetchUserProfile() {
      if (session?.user) {
        try {
          setLoading(true)
          
          // Fetch user profile
          const profileResponse = await fetch('/api/user/profile')
          if (profileResponse.ok) {
            const profileData = await profileResponse.json()
            
            // Fetch user stats
            const statsResponse = await fetch('/api/user/stats')
            const statsData = await statsResponse.ok ? await statsResponse.json() : { completedSections: 0, percentile: "0%" }
            
            // Fetch user reading history
            const historyResponse = await fetch('/api/user/history')
            const historyData = await historyResponse.ok ? await historyResponse.json() : { completions: [] }
            
            setUserProfile({
              ...userProfile,
              name: session.user.name || "",
              email: session.user.email || "",
              username: profileData.username || `user_${session.user.id?.substring(0, 8) || ""}`,
              bio: profileData.bio || "No bio provided",
              totalParasRead: statsData.completedSections || 0,
              khatmsParticipated: profileData.khatmsParticipated || 1,
              readingStreak: profileData.readingStreak || 0,
              achievements: profileData.achievements?.length || 0,
              emailNotifications: profileData.emailNotifications ?? true,
              language: profileData.language || "English"
            })
            
            setRecentCompletions(historyData.completions || [])
          }
        } catch (error) {
          console.error("Error fetching user profile:", error)
        } finally {
          setLoading(false)
        }
      }
    }
    
    if (session?.user) {
      fetchUserProfile()
    }
  }, [session])

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userProfile.username,
          bio: userProfile.bio,
          emailNotifications: userProfile.emailNotifications,
          language: userProfile.language
        }),
      })

      if (response.ok) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        })
        setUserProfile({ ...userProfile, isEditing: false })
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "An error occurred while updating your profile.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-islamic-cream dark:bg-slate-950 py-10">
        <div className="container mx-auto px-4">
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mx-auto"></div>
            <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-islamic-cream dark:bg-slate-950 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-islamic-primary dark:text-islamic-accent text-center mb-8">
          Your Profile
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info */}
          <Card className="bg-white dark:bg-slate-900 shadow-md">
            <CardContent className="p-6 flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="bg-islamic-primary text-white text-2xl">
                  {userProfile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {userProfile.isEditing ? (
                <Input 
                  className="mb-2 text-center text-2xl font-bold"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                  disabled
                />
              ) : (
                <h2 className="text-2xl font-bold mb-1">{userProfile.name}</h2>
              )}
              
              <p className="text-slate-600 dark:text-slate-400 mb-4">{userProfile.email}</p>

              {userProfile.isEditing ? (
                <>
                  <div className="w-full mb-4">
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <Input 
                      value={userProfile.username}
                      onChange={(e) => setUserProfile({ ...userProfile, username: e.target.value })}
                      className="w-full"
                      placeholder="@username"
                    />
                  </div>
                  <div className="w-full mb-4">
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <Textarea 
                      value={userProfile.bio}
                      onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                      className="w-full"
                      placeholder="Tell us about yourself"
                    />
                  </div>
                </>
              ) : (
                <>
                  <p className="text-slate-600 dark:text-slate-400 mb-2">@{userProfile.username}</p>
                  <p className="text-center mb-4 text-sm">{userProfile.bio}</p>
                </>
              )}

              <div className="flex flex-wrap gap-2 justify-center mb-6">
                <Badge variant="outline" className="bg-islamic-light text-islamic-primary">
                  Active Reader
                </Badge>
                {userProfile.khatmsParticipated > 0 && (
                  <Badge variant="outline" className="bg-islamic-light text-islamic-primary">
                    {userProfile.khatmsParticipated} Khatm{userProfile.khatmsParticipated !== 1 && 's'}
                  </Badge>
                )}
                {userProfile.totalParasRead > 10 && (
                  <Badge variant="outline" className="bg-islamic-light text-islamic-primary">
                    Top Contributor
                  </Badge>
                )}
              </div>

              {userProfile.isEditing ? (
                <div className="flex gap-2">
                  <Button onClick={handleUpdateProfile} className="bg-islamic-primary hover:bg-islamic-dark text-white">
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setUserProfile({ ...userProfile, isEditing: false })}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => setUserProfile({ ...userProfile, isEditing: true })}
                  className="bg-islamic-primary hover:bg-islamic-dark text-white"
                >
                  Edit Profile
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Right Column - Profile Tabs */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="reading-history">Reading History</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader className="text-xl font-semibold">Account Statistics</CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Total Paras Read</p>
                        <p className="text-3xl font-bold text-islamic-primary">{userProfile.totalParasRead}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Khatms Participated</p>
                        <p className="text-3xl font-bold text-islamic-primary">{userProfile.khatmsParticipated}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Reading Streak</p>
                        <p className="text-3xl font-bold text-islamic-primary">{userProfile.readingStreak} days</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Achievements</p>
                        <p className="text-3xl font-bold text-islamic-primary">{userProfile.achievements}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="text-xl font-semibold">Account Settings</CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Receive updates about your reading progress</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant={userProfile.emailNotifications ? "default" : "outline"}
                          className={userProfile.emailNotifications ? "bg-islamic-primary text-white" : ""}
                          onClick={() => setUserProfile({ ...userProfile, emailNotifications: true })}
                          disabled={!userProfile.isEditing}
                        >
                          Enabled
                        </Button>
                        <Button 
                          variant={!userProfile.emailNotifications ? "default" : "outline"}
                          className={!userProfile.emailNotifications ? "bg-islamic-primary text-white" : ""}
                          onClick={() => setUserProfile({ ...userProfile, emailNotifications: false })}
                          disabled={!userProfile.isEditing}
                        >
                          Disabled
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Language Preference</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Choose your preferred language</p>
                      </div>
                      <div>
                        <Button 
                          variant="outline" 
                          disabled={!userProfile.isEditing}
                        >
                          {userProfile.language}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reading-history">
                <Card>
                  <CardHeader className="text-xl font-semibold">Your Reading History</CardHeader>
                  <CardContent>
                    {recentCompletions.length > 0 ? (
                      <div className="space-y-4">
                        {recentCompletions.map((completion, index) => (
                          <div key={index} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex justify-between">
                            <div>
                              <h4 className="font-medium">
                                Para {completion.paraNumber}
                                {completion.rukuNumber ? ` (Ruku ${completion.rukuNumber})` : " (Entire Para)"}
                              </h4>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                Completed on {new Date(completion.completedAt).toLocaleDateString()} at {new Date(completion.completedAt).toLocaleTimeString()}
                              </p>
                            </div>
                            <Badge className="bg-islamic-primary text-white">Completed</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        <p>No reading history available yet.</p>
                        <p className="mt-2">Complete some paras to see your history here.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements">
                <Card>
                  <CardHeader className="text-xl font-semibold">Your Achievements</CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className={`p-4 border rounded-lg ${userProfile.totalParasRead >= 1 ? "border-islamic-primary bg-islamic-light/20" : "border-slate-200 opacity-50"}`}>
                        <h4 className="font-medium">First Para</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Complete your first para</p>
                        {userProfile.totalParasRead >= 1 && (
                          <Badge className="mt-2 bg-islamic-primary text-white">Unlocked</Badge>
                        )}
                      </div>
                      <div className={`p-4 border rounded-lg ${userProfile.totalParasRead >= 5 ? "border-islamic-primary bg-islamic-light/20" : "border-slate-200 opacity-50"}`}>
                        <h4 className="font-medium">Dedicated Reader</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Complete 5 or more paras</p>
                        {userProfile.totalParasRead >= 5 && (
                          <Badge className="mt-2 bg-islamic-primary text-white">Unlocked</Badge>
                        )}
                      </div>
                      <div className={`p-4 border rounded-lg ${userProfile.totalParasRead >= 10 ? "border-islamic-primary bg-islamic-light/20" : "border-slate-200 opacity-50"}`}>
                        <h4 className="font-medium">Consistent Contributor</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Complete 10 or more paras</p>
                        {userProfile.totalParasRead >= 10 && (
                          <Badge className="mt-2 bg-islamic-primary text-white">Unlocked</Badge>
                        )}
                      </div>
                      <div className={`p-4 border rounded-lg ${userProfile.readingStreak >= 7 ? "border-islamic-primary bg-islamic-light/20" : "border-slate-200 opacity-50"}`}>
                        <h4 className="font-medium">Weekly Commitment</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Maintain a reading streak of 7 days</p>
                        {userProfile.readingStreak >= 7 && (
                          <Badge className="mt-2 bg-islamic-primary text-white">Unlocked</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

