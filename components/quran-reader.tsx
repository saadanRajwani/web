"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import ReadingGoalSelector from "@/components/reading-goal-selector"
import QuranContent from "@/components/quran-content"
import { calculateProgress, getReadingPlan } from "@/lib/quran-utils"

export default function QuranReader() {
  const { toast } = useToast()
  const [readingUnit, setReadingUnit] = useState<"juz" | "ruku">("juz")
  const [unitsPerSession, setUnitsPerSession] = useState<number>(1)
  const [goalType, setGoalType] = useState<"day" | "week" | "month">("day")
  const [currentPosition, setCurrentPosition] = useState({
    juz: 1,
    ruku: 1,
    completed: 0,
  })
  const [totalCompleted, setTotalCompleted] = useState<number>(0)

  // Load saved progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem("quranProgress")
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress)
        setCurrentPosition(parsed.currentPosition)
        setTotalCompleted(parsed.totalCompleted || 0)
        setReadingUnit(parsed.readingUnit || "juz")
        setUnitsPerSession(parsed.unitsPerSession || 1)
        setGoalType(parsed.goalType || "day")
      } catch (e) {
        console.error("Error parsing saved progress", e)
      }
    }
  }, [])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "quranProgress",
      JSON.stringify({
        currentPosition,
        totalCompleted,
        readingUnit,
        unitsPerSession,
        goalType,
      }),
    )
  }, [currentPosition, totalCompleted, readingUnit, unitsPerSession, goalType])

  const handleUnitChange = (value: "juz" | "ruku") => {
    setReadingUnit(value)
    // Reset units per session to a reasonable default when changing unit type
    setUnitsPerSession(value === "juz" ? 1 : 5)
  }

  const handleUnitsPerSessionChange = (value: number[]) => {
    setUnitsPerSession(value[0])
  }

  const handleGoalTypeChange = (value: "day" | "week" | "month") => {
    setGoalType(value)
  }

  const markAsRead = () => {
    const totalUnits = readingUnit === "juz" ? 30 : 240 // 30 juz or approx 240 rukus
    const newPosition = { ...currentPosition }

    // Update position based on reading unit
    if (readingUnit === "juz") {
      newPosition.juz += unitsPerSession
      if (newPosition.juz > 30) {
        newPosition.juz = 1
        newPosition.completed += 1
        setTotalCompleted((prev) => prev + 1)
        toast({
          title: "Masha'Allah!",
          description: `You've completed the Quran ${newPosition.completed} times. A new reading has automatically started.`,
        })
      }
    } else {
      newPosition.ruku += unitsPerSession
      if (newPosition.ruku > 240) {
        newPosition.ruku = 1
        newPosition.completed += 1
        setTotalCompleted((prev) => prev + 1)
        toast({
          title: "Masha'Allah!",
          description: `You've completed the Quran ${newPosition.completed} times. A new reading has automatically started.`,
        })
      }
    }

    setCurrentPosition(newPosition)
  }

  const resetProgress = () => {
    setCurrentPosition({
      juz: 1,
      ruku: 1,
      completed: 0,
    })
    toast({
      title: "Progress Reset",
      description: "Your reading progress has been reset.",
    })
  }

  const progress = calculateProgress(currentPosition, readingUnit)
  const { sessionsRequired, estimatedCompletion } = getReadingPlan(readingUnit, unitsPerSession, goalType)

  const maxUnitsPerSession = readingUnit === "juz" ? 10 : 20

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Your Quran Reading Journey</CardTitle>
          <CardDescription className="text-center">Set your reading goals and track your progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Current Progress</h3>
              <Progress value={progress} className="h-3" />
              <p className="text-sm text-muted-foreground text-center">{progress.toFixed(1)}% Complete</p>
              <div className="text-center text-sm">
                {readingUnit === "juz"
                  ? `Currently at Juz ${currentPosition.juz} of 30`
                  : `Currently at Ruku ${currentPosition.ruku} of 240`}
              </div>
              {currentPosition.completed > 0 && (
                <div className="text-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  Total Quran completions: {currentPosition.completed}
                </div>
              )}
            </div>

            <Tabs defaultValue="reading-unit" className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="reading-unit">Reading Unit</TabsTrigger>
                <TabsTrigger value="reading-goal">Reading Goal</TabsTrigger>
              </TabsList>

              <TabsContent value="reading-unit" className="space-y-4">
                <div className="grid grid-cols-2 gap-4 my-4">
                  <Button
                    variant={readingUnit === "juz" ? "default" : "outline"}
                    onClick={() => handleUnitChange("juz")}
                    className="h-16"
                  >
                    <div className="flex flex-col">
                      <span className="text-lg">Juz</span>
                      <span className="text-xs">(30 total)</span>
                    </div>
                  </Button>
                  <Button
                    variant={readingUnit === "ruku" ? "default" : "outline"}
                    onClick={() => handleUnitChange("ruku")}
                    className="h-16"
                  >
                    <div className="flex flex-col">
                      <span className="text-lg">Ruku</span>
                      <span className="text-xs">(~240 total)</span>
                    </div>
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      {readingUnit === "juz" ? "Juz" : "Rukus"} per session: {unitsPerSession}
                    </span>
                  </div>
                  <Slider
                    value={[unitsPerSession]}
                    min={1}
                    max={maxUnitsPerSession}
                    step={1}
                    onValueChange={handleUnitsPerSessionChange}
                  />
                </div>
              </TabsContent>

              <TabsContent value="reading-goal">
                <ReadingGoalSelector
                  goalType={goalType}
                  onGoalTypeChange={handleGoalTypeChange}
                  readingUnit={readingUnit}
                  unitsPerSession={unitsPerSession}
                  sessionsRequired={sessionsRequired}
                  estimatedCompletion={estimatedCompletion}
                />
              </TabsContent>
            </Tabs>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button onClick={markAsRead} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                Mark as Read
              </Button>
              <Button variant="outline" onClick={resetProgress} className="flex-1">
                Reset Progress
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <QuranContent currentPosition={currentPosition} readingUnit={readingUnit} />
    </div>
  )
}

