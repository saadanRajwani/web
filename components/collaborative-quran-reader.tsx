"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import ParaSelector from "@/components/para-selector"
import CommunityProgress from "@/components/community-progress"
import QuranContentDisplay from "@/components/quran-content-display"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

type CommunityData = {
  currentKhatm: number;
  goalType: "day" | "week" | "month";
  startDate: string;
  endDate: string;
  totalParticipants: number;
  sectionsCompleted: number;
  totalSections: number;
}

type UserProgress = {
  id: string;
  section: {
    paraNumber: number;
    rukuNumber: number | null;
  };
  isCompleted: boolean;
  updatedAt: string;
}

// Add a helper function to safely parse JSON responses
const safeJsonParse = async (response: Response) => {
  const text = await response.text();
  try {
    // Check if response is HTML (common hosting issue)
    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
      console.error('Received HTML instead of JSON:', text.substring(0, 100));
      throw new Error('Server returned HTML instead of JSON. This usually indicates a server configuration issue.');
    }
    return JSON.parse(text);
  } catch (error: any) {
    console.error('Failed to parse JSON:', error);
    throw new Error(`JSON parsing failed: ${error.message}`);
  }
};

export default function CollaborativeQuranReader() {
  const { toast } = useToast()
  const { data: session } = useSession()
  const [goalType, setGoalType] = useState<"day" | "week" | "month">("day")
  const [communityData, setCommunityData] = useState<CommunityData>({
    currentKhatm: 1,
    goalType: "day",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    totalParticipants: 0,
    sectionsCompleted: 0,
    totalSections: 30,
  })
  const [userPara, setUserPara] = useState<number | null>(null)
  const [userRuku, setUserRuku] = useState<number | null>(null)
  const [userCompleted, setUserCompleted] = useState(false)
  const [activeTab, setActiveTab] = useState<"reading" | "content">("reading")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch community data (current khatm)
  useEffect(() => {
    async function fetchKhatmData() {
      try {
        const response = await fetch('/api/khatm')
        if (!response.ok) {
          throw new Error('Failed to fetch khatm data')
        }
        const data = await response.json()
        setCommunityData({
          currentKhatm: data.khatmNumber,
          goalType: data.goalType as "day" | "week" | "month",
          startDate: data.startDate,
          endDate: data.endDate,
          totalParticipants: data.totalParticipants,
          sectionsCompleted: data.sectionsCompleted,
          totalSections: data.totalSections,
        })
        setGoalType(data.goalType as "day" | "week" | "month")
      } catch (error) {
        console.error('Error fetching khatm data:', error)
      }
    }

    fetchKhatmData()
  }, [])

  // Fetch user progress if logged in
  useEffect(() => {
    async function fetchUserProgress() {
      if (!session?.user) return
      
      try {
        const response = await fetch('/api/progress')
        if (!response.ok) {
          throw new Error('Failed to fetch user progress')
        }
        
        const data = await response.json()
        
        // Find the latest progress
        if (data.userProgress && data.userProgress.length > 0) {
          const latestProgress = data.userProgress.sort((a: UserProgress, b: UserProgress) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )[0]
          
          setUserPara(latestProgress.section.paraNumber)
          setUserRuku(latestProgress.section.rukuNumber)
          setUserCompleted(latestProgress.isCompleted)
        }
      } catch (error) {
        console.error('Error fetching user progress:', error)
      }
    }

    fetchUserProgress()
  }, [session])

  const handleGoalTypeChange = async (value: "day" | "week" | "month") => {
    setGoalType(value)
    setIsLoading(true)

    try {
      const response = await fetch('/api/khatm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goalType: value }),
      })

      if (!response.ok) {
        throw new Error('Failed to update goal type')
      }

      const data = await response.json()
      setCommunityData(prev => ({
        ...prev,
        goalType: value,
        endDate: data.endDate,
      }))

      toast({
        title: "Goal Updated",
        description: `The community goal has been updated to complete the Quran in 1 ${value}.`,
      })
    } catch (error) {
      console.error('Error updating goal type:', error)
      toast({
        title: "Failed to Update Goal",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleParaSelect = async (paraNumber: number, rukuNumber: number | null = null) => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to commit to reading a section.",
        variant: "destructive",
      })
      return
    }
    
    setUserPara(paraNumber)
    setUserRuku(rukuNumber)
    setUserCompleted(false)
    setActiveTab("content")

    const rukuText = rukuNumber ? ` (Ruku ${rukuNumber})` : ""

    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paraNumber,
          rukuNumber,
          completed: false,
        }),
      })

      toast({
        title: "Para Selected",
        description: `You've committed to read Para ${paraNumber}${rukuText}.`,
      })
    } catch (error) {
      console.error('Error saving para selection:', error)
      toast({
        title: "Error",
        description: "Failed to save your selection. Please try again.",
        variant: "destructive",
      })
    }
  }

  const markAsCompleted = async () => {
    if (!session || !session.user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to mark your reading as completed.",
        variant: "destructive",
      })
      return
    }

    if (!userPara) {
      toast({
        title: "No Para Selected",
        description: "Please select a Para to mark as completed.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paraNumber: userPara,
          completed: true,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = 'Failed to mark as completed'
        
        try {
          if (errorText.trim().startsWith('<!DOCTYPE') || errorText.trim().startsWith('<html')) {
            console.error('Server returned HTML instead of JSON:', errorText.substring(0, 100))
            throw new Error('Server configuration issue. Please contact support.')
          }
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          console.error('Error parsing response:', parseError)
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      
      toast({
        title: "Success",
        description: "Para marked as completed successfully!",
      })

      setUserCompleted(true)
      
      // Refresh community data
      const khatmResponse = await fetch('/api/khatm')
      if (khatmResponse.ok) {
        const khatmData = await khatmResponse.json()
        setCommunityData({
          currentKhatm: khatmData.khatmNumber,
          goalType: khatmData.goalType as "day" | "week" | "month",
          startDate: khatmData.startDate,
          endDate: khatmData.endDate,
          totalParticipants: khatmData.totalParticipants,
          sectionsCompleted: khatmData.sectionsCompleted,
          totalSections: khatmData.totalSections,
        })
      }

      // Check if the entire Quran is completed
      if (communityData.sectionsCompleted + 1 >= communityData.totalSections) {
        // This would be handled by the server in a real implementation
        toast({
          title: "Masha'Allah!",
          description: "The community has completed the entire Quran! A new reading cycle has begun.",
        })
      }
    } catch (error: any) {
      console.error('Error marking as completed:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to mark as completed",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const progressPercentage = (communityData.sectionsCompleted / communityData.totalSections) * 100

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <CardTitle className="text-2xl">Community Quran Reading</CardTitle>
            <Badge
              variant="outline"
              className="bg-islamic-light text-islamic-primary dark:bg-islamic-dark/50 dark:text-islamic-accent"
            >
              Khatm #{communityData.currentKhatm}
            </Badge>
          </div>
          <CardDescription>
            Join hundreds of believers to complete the Quran together in a {communityData.goalType}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Community Progress</h3>
                <span className="text-sm font-medium">
                  {communityData.sectionsCompleted} of {communityData.totalSections} paras
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-sm text-muted-foreground text-center">{progressPercentage.toFixed(1)}% Complete</p>
            </div>

            <Tabs defaultValue="reading-goal" className="w-full">
              <TabsList className="grid grid-cols-1 w-full">
                <TabsTrigger value="reading-goal">Reading Goal</TabsTrigger>
              </TabsList>

              <TabsContent value="reading-goal" className="space-y-4">
                <div className="grid grid-cols-3 gap-2 my-4">
                  <Button
                    variant={goalType === "day" ? "default" : "outline"}
                    onClick={() => handleGoalTypeChange("day")}
                    className="h-14"
                  >
                    Daily
                  </Button>
                  <Button
                    variant={goalType === "week" ? "default" : "outline"}
                    onClick={() => handleGoalTypeChange("week")}
                    className="h-14"
                  >
                    Weekly
                  </Button>
                  <Button
                    variant={goalType === "month" ? "default" : "outline"}
                    onClick={() => handleGoalTypeChange("month")}
                    className="h-14"
                  >
                    Monthly
                  </Button>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm mb-2">
                    <span className="font-medium">Goal:</span> Complete the entire Quran as a community in 1 {goalType}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Target completion date:</span>{" "}
                    {new Date(communityData.endDate).toLocaleDateString()}
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Your Contribution</h3>

              {userPara && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-islamic-light dark:bg-islamic-dark/50 p-4 rounded-lg border border-islamic-primary/20 dark:border-islamic-accent/20"
                >
                  <p className="font-medium text-islamic-primary dark:text-islamic-accent">
                    You've committed to read Para {userPara}
                    {userRuku ? ` (Ruku ${userRuku})` : " (Entire Para)"}
                  </p>
                  {userCompleted ? (
                    <p className="text-sm text-islamic-primary/80 dark:text-islamic-accent/80 mt-2">
                      Completed! Thank you for your contribution.
                    </p>
                  ) : (
                    <Button
                      onClick={markAsCompleted}
                      className="mt-2 bg-islamic-primary hover:bg-islamic-dark text-white"
                    >
                      Mark as Completed
                    </Button>
                  )}
                </motion.div>
              )}

              {!userPara && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-900"
                >
                  <p className="text-blue-800 dark:text-blue-300">
                    You haven't selected a para to read yet. Please select one below.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="reading">
        <TabsList className="grid grid-cols-1 w-full max-w-md mx-auto">
          <TabsTrigger value="reading">Select Para</TabsTrigger>
        </TabsList>

        <TabsContent value="reading" className="mt-6">
          <ParaSelector
            onParaSelect={handleParaSelect}
            userPara={userPara}
            userParaSection={userRuku}
            userCompleted={userCompleted}
            communityData={communityData}
          />
        </TabsContent>
      </Tabs>

      <CommunityProgress communityData={communityData} />
    </div>
  )
}

