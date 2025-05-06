"use client"

import { Button } from "@/components/ui/button"

interface ReadingGoalSelectorProps {
  goalType: "day" | "week" | "month"
  onGoalTypeChange: (value: "day" | "week" | "month") => void
  readingUnit: "juz" | "ruku"
  unitsPerSession: number
  sessionsRequired: number
  estimatedCompletion: string
}

export default function ReadingGoalSelector({
  goalType,
  onGoalTypeChange,
  readingUnit,
  unitsPerSession,
  sessionsRequired,
  estimatedCompletion,
}: ReadingGoalSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant={goalType === "day" ? "default" : "outline"}
          onClick={() => onGoalTypeChange("day")}
          className="h-14"
        >
          Daily
        </Button>
        <Button
          variant={goalType === "week" ? "default" : "outline"}
          onClick={() => onGoalTypeChange("week")}
          className="h-14"
        >
          Weekly
        </Button>
        <Button
          variant={goalType === "month" ? "default" : "outline"}
          onClick={() => onGoalTypeChange("month")}
          className="h-14"
        >
          Monthly
        </Button>
      </div>

      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg space-y-2">
        <p className="text-sm">
          <span className="font-medium">Your plan:</span> Read {unitsPerSession} {readingUnit}
          {unitsPerSession > 1 ? "s" : ""} per session
        </p>
        <p className="text-sm">
          <span className="font-medium">Sessions required:</span> {sessionsRequired} sessions per {goalType}
        </p>
        <p className="text-sm">
          <span className="font-medium">Estimated completion:</span> {estimatedCompletion}
        </p>
      </div>
    </div>
  )
}

