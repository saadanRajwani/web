"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import CollaborativeQuranReader from "@/components/collaborative-quran-reader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Award } from "lucide-react"

export default function DashboardPage() {
  const { data: session } = useSession()
  const [khatmData, setKhatmData] = useState({
    khatmNumber: 1,
    goalType: "day",
    sectionsCompleted: 0,
    totalSections: 30,
    totalParticipants: 0
  })
  const [userStats, setUserStats] = useState({
    completedSections: 0,
    percentile: "0%"
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch khatm data
        const khatmResponse = await fetch('/api/khatm')
        if (khatmResponse.ok) {
          const data = await khatmResponse.json()
          setKhatmData(data)
        }

        // Fetch user stats if logged in
        if (session?.user) {
          const userStatsResponse = await fetch('/api/user/stats')
          if (userStatsResponse.ok) {
            const data = await userStatsResponse.json()
            setUserStats(data)
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session])

  const progressPercentage = Math.round((khatmData.sectionsCompleted / khatmData.totalSections) * 100)

  return (
    <div className="min-h-screen bg-islamic-cream dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-islamic-primary dark:text-islamic-accent mb-4">
            Collaborative Quran Reading
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Join hundreds of believers to collectively complete the Quran. Select a para to read and contribute to our
            shared goal of completing the Quran together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="animate-enter">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-islamic-primary" />
                Current Khatm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-islamic-primary">#{khatmData.khatmNumber}</p>
                  <p className="text-sm text-muted-foreground">{khatmData.goalType === 'day' ? 'Daily' : khatmData.goalType === 'week' ? 'Weekly' : 'Monthly'} Goal</p>
                </div>
                <Badge variant="outline" className="bg-islamic-light text-islamic-primary">
                  {progressPercentage}% Complete
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="animate-enter animate-enter-delay-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2 text-islamic-primary" />
                Active Participants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-islamic-primary">{khatmData.totalParticipants}</p>
                  <p className="text-sm text-muted-foreground">Participating now</p>
                </div>
                <Badge variant="outline" className="bg-islamic-light text-islamic-primary">
                  Community
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="animate-enter animate-enter-delay-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Award className="h-5 w-5 mr-2 text-islamic-primary" />
                Your Contributions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-islamic-primary">{userStats.completedSections}</p>
                  <p className="text-sm text-muted-foreground">Paras completed</p>
                </div>
                <Badge variant="outline" className="bg-islamic-light text-islamic-primary">
                  {session ? userStats.percentile : 'Sign in'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reading" className="mb-8">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="reading">Reading</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>
          <TabsContent value="reading" className="mt-6">
            <CollaborativeQuranReader />
          </TabsContent>
          <TabsContent value="statistics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Reading Statistics</CardTitle>
                <CardDescription>Track your contributions over time</CardDescription>
              </CardHeader>
              <CardContent>
                {session ? (
                  <div className="space-y-6">
                    <div className="h-[300px] flex flex-col space-y-4">
                      {loading ? (
                        <p className="text-muted-foreground flex items-center justify-center h-full">Loading statistics...</p>
                      ) : (
                        <>
                          <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-6 flex-1">
                            <h3 className="text-lg mb-2 font-medium">Reading Progress</h3>
                            <div className="flex justify-between mb-2">
                              <div className="text-center">
                                <p className="text-2xl font-bold text-islamic-primary">{userStats.completedSections}</p>
                                <p className="text-sm text-muted-foreground">Completed</p>
                              </div>
                              <div className="text-center">
                                <p className="text-2xl font-bold text-islamic-primary">{khatmData.totalSections - userStats.completedSections}</p>
                                <p className="text-sm text-muted-foreground">Remaining</p>
                              </div>
                              <div className="text-center">
                                <p className="text-2xl font-bold text-islamic-primary">{userStats.percentile}</p>
                                <p className="text-sm text-muted-foreground">Percentile</p>
                              </div>
                            </div>
                            
                            <div className="mt-4 space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Your Progress</span>
                                <span className="text-sm font-medium">
                                  {userStats.completedSections} of {khatmData.totalSections} paras
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                                <div
                                  className="bg-islamic-primary h-3 rounded-full"
                                  style={{
                                    width: `${(userStats.completedSections / khatmData.totalSections) * 100}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 border rounded-md">
                            <h3 className="font-medium mb-2">Recently Completed Sections</h3>
                            {userStats.completedSections > 0 ? (
                              <div className="grid grid-cols-5 gap-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <div 
                                    key={i} 
                                    className={`p-2 text-center rounded ${
                                      i < userStats.completedSections 
                                        ? "bg-islamic-primary/20 text-islamic-primary dark:bg-islamic-primary/30 dark:text-islamic-accent" 
                                        : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                                    }`}
                                  >
                                    {i < userStats.completedSections ? `Para ${i + 1}` : "—"}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground text-center py-2">
                                Complete a para to see your history
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Reading Insights</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-islamic-primary"></div>
                            <span>You've contributed {Math.round((userStats.completedSections / khatmData.totalSections) * 100)}% to the current Khatm</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-islamic-primary"></div>
                            <span>You're in the {userStats.percentile} of contributors</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-islamic-primary"></div>
                            <span>Community completion: {progressPercentage.toFixed(0)}%</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center border rounded-md p-4">
                    <p className="text-muted-foreground">Sign in to view your reading statistics</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

