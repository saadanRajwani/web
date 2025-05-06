"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface CommunityProgressProps {
  communityData: {
    currentKhatm: number
    goalType: "day" | "week" | "month"
    startDate: string
    endDate: string
    totalParticipants: number
    sectionsCompleted: number
    totalSections: number
  }
}

interface CompletedSection {
  id: string
  user: {
    name: string
  }
  section: {
    paraNumber: number
    rukuNumber: number | null
  }
  completedAt: string
}

export default function CommunityProgress({ communityData }: CommunityProgressProps) {
  const [recentCompletions, setRecentCompletions] = useState<Array<{
    name: string
    section: string
    time: string
  }>>([])

  // Fetch recent completions from the API
  useEffect(() => {
    async function fetchRecentCompletions() {
      try {
        // Add timestamp to avoid caching
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/completions?t=${timestamp}`)
        if (response.ok) {
          const data = await response.json()
          
          // Format the completions data
          const formattedCompletions = data.completions.map((completion: CompletedSection) => {
            const paraText = completion.section.rukuNumber 
              ? `Para ${completion.section.paraNumber} (Ruku ${completion.section.rukuNumber})` 
              : `Para ${completion.section.paraNumber}`
            
            // Calculate time ago
            const completedTime = new Date(completion.completedAt || new Date())
            const now = new Date()
            const diffMs = now.getTime() - completedTime.getTime()
            const diffMins = Math.round(diffMs / 60000)
            
            let timeAgo
            if (diffMins < 60) {
              timeAgo = `${diffMins === 0 ? "just now" : `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`}`
            } else if (diffMins < 24 * 60) {
              const hours = Math.floor(diffMins / 60)
              timeAgo = `${hours} hour${hours !== 1 ? 's' : ''} ago`
            } else {
              const days = Math.floor(diffMins / (24 * 60))
              timeAgo = `${days} day${days !== 1 ? 's' : ''} ago`
            }
            
            return {
              name: completion.user?.name || 'Anonymous',
              section: paraText,
              time: timeAgo
            }
          }).slice(0, 5) // Get only the 5 most recent completions
          
          setRecentCompletions(formattedCompletions)
        }
      } catch (error) {
        console.error('Error fetching recent completions:', error)
        
        // Fallback to minimal sample data if API fails
        setRecentCompletions([
          { name: "Guest", section: "Para 1", time: "just now" }
        ])
      }
    }
    
    fetchRecentCompletions()
    
    // Set up a refresh interval to check for new completions
    const intervalId = setInterval(fetchRecentCompletions, 10000); // Refresh every 10 seconds
    
    return () => {
      clearInterval(intervalId); // Clean up on unmount
    };
  }, [communityData])

  // Calculate time remaining
  const endDate = new Date(communityData.endDate)
  const now = new Date()
  const timeRemaining = endDate.getTime() - now.getTime()

  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  let timeRemainingText = ""
  if (days > 0) {
    timeRemainingText = `${days} day${days > 1 ? "s" : ""} and ${hours} hour${hours > 1 ? "s" : ""}`
  } else if (hours > 0) {
    timeRemainingText = `${hours} hour${hours > 1 ? "s" : ""}`
  } else {
    timeRemainingText = "Less than an hour"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Community Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {communityData.totalParticipants}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Participants</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {communityData.sectionsCompleted}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Paras Completed</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{communityData.currentKhatm}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Current Khatm</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{timeRemainingText}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Time Remaining</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Completions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCompletions.map((completion, index) => (
              <div key={index} className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                    {completion.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{completion.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Completed {completion.section}</p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{completion.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

