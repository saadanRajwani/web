"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface QuranContentProps {
  currentPosition: {
    juz: number
    ruku: number
    completed: number
  }
  readingUnit: "juz" | "ruku"
}

export default function QuranContent({ currentPosition, readingUnit }: QuranContentProps) {
  // In a real implementation, this would fetch the actual Quran content
  // based on the current position (juz or ruku)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-center">
          {readingUnit === "juz" ? `Juz ${currentPosition.juz}` : `Ruku ${currentPosition.ruku}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center italic text-sm text-muted-foreground mb-4">
          {readingUnit === "juz"
            ? `This would display the content of Juz ${currentPosition.juz}`
            : `This would display the content of Ruku ${currentPosition.ruku}`}
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-950/30 p-6 rounded-lg border border-emerald-200 dark:border-emerald-900 text-center">
          <p className="text-emerald-800 dark:text-emerald-300 mb-4">
            In a complete implementation, this section would display the actual Quran text in Arabic with translation
            and transliteration.
          </p>
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            You would need to integrate with a Quran API or database to fetch the specific verses based on the selected
            juz or ruku.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

