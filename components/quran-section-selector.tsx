"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface QuranSectionSelectorProps {
  divisionType: "juz" | "ruku"
  onSectionSelect: (sectionNumber: number) => void
  userSection: number | null
  userCompleted: boolean
  communityData: {
    sectionsCompleted: number
    totalSections: number
    // Other properties...
  }
}

export default function QuranSectionSelector({
  divisionType,
  onSectionSelect,
  userSection,
  userCompleted,
  communityData,
}: QuranSectionSelectorProps) {
  // Generate an array of section numbers based on division type
  const totalSections = divisionType === "juz" ? 30 : 240
  const sections = Array.from({ length: totalSections }, (_, i) => i + 1)

  // In a real app, this would come from a database
  // For this mock, we'll generate random sections as "taken"
  const takenSections = new Set<number>()
  const completedSections = new Set<number>()

  // Add some random sections as "taken" or "completed"
  for (let i = 1; i <= totalSections; i++) {
    // Skip user's section
    if (i === userSection) continue

    // Randomly mark some sections as taken or completed
    const random = Math.random()
    if (random < 0.3) {
      takenSections.add(i)
    } else if (random < 0.5) {
      completedSections.add(i)
    }
  }

  // If user has completed their section, add it to completedSections
  if (userSection && userCompleted) {
    completedSections.add(userSection)
  } else if (userSection) {
    takenSections.add(userSection)
  }

  // Function to get button variant based on section status
  const getButtonVariant = (section: number) => {
    if (userSection === section) {
      return userCompleted ? "default" : "secondary"
    } else if (completedSections.has(section)) {
      return "default"
    } else if (takenSections.has(section)) {
      return "outline"
    } else {
      return "ghost"
    }
  }

  // Function to get button class based on section status
  const getButtonClass = (section: number) => {
    if (userSection === section) {
      return userCompleted
        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
        : "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100"
    } else if (completedSections.has(section)) {
      return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-100"
    } else if (takenSections.has(section)) {
      return "border-amber-300 text-amber-800 dark:border-amber-700 dark:text-amber-300"
    } else {
      return ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Select a Section to Read</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            <span>Your Section</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500"></div>
            <span>Taken</span>
          </div>
        </div>

        <ScrollArea className="h-[300px] pr-4">
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2">
            {sections.map((section) => (
              <Button
                key={section}
                variant={getButtonVariant(section) as any}
                className={getButtonClass(section)}
                onClick={() => {
                  // Only allow selection if not already taken or completed
                  if (!takenSections.has(section) && !completedSections.has(section)) {
                    onSectionSelect(section)
                  }
                }}
                disabled={(takenSections.has(section) && userSection !== section) || completedSections.has(section)}
              >
                {section}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

