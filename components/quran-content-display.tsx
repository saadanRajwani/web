"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface QuranContentDisplayProps {
  paraNumber: number | null
  rukuNumber: number | null
}

export default function QuranContentDisplay({ paraNumber, rukuNumber }: QuranContentDisplayProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  // Mock Quran content - in a real app, this would come from an API
  const mockContent = {
    arabic:
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\nالرَّحْمَٰنِ الرَّحِيمِ\nمَالِكِ يَوْمِ الدِّينِ\nإِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ\nاهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ\nصِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    translation:
      "In the name of Allah, the Entirely Merciful, the Especially Merciful.\nAll praise is due to Allah, Lord of the worlds.\nThe Entirely Merciful, the Especially Merciful.\nSovereign of the Day of Recompense.\nIt is You we worship and You we ask for help.\nGuide us to the straight path.\nThe path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
    transliteration:
      "Bismillāhi r-raḥmāni r-raḥīm\nAl-ḥamdu lillāhi rabbi l-ʿālamīn\nAr-raḥmāni r-raḥīm\nMāliki yawmi d-dīn\nIyyāka naʿbudu wa-iyyāka nastaʿīn\nIhdinā ṣ-ṣirāṭa l-mustaqīm\nṢirāṭa llaḏīna anʿamta ʿalayhim ġayri l-maġḍūbi ʿalayhim wa-lā ḍ-ḍāllīn",
  }

  useEffect(() => {
    if (paraNumber) {
      setIsLoading(true)
      // Simulate API call to fetch Quran content
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [paraNumber, rukuNumber])

  if (!paraNumber) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-center">Quran Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center italic text-sm text-muted-foreground mb-4">
            Please select a para to view its content
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-center">
          {isLoading ? (
            <Skeleton className="h-6 w-48 mx-auto" />
          ) : (
            <>
              Para {paraNumber} {rukuNumber ? `- Ruku ${rukuNumber}` : ""}
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="quran-arabic text-xl leading-loose text-right">
              {mockContent.arabic.split("\n").map((line, index) => (
                <p key={index} className="mb-2">
                  {line}
                </p>
              ))}
            </div>

            <div className="quran-translation text-sm">
              <h3 className="font-medium mb-2">Translation:</h3>
              {mockContent.translation.split("\n").map((line, index) => (
                <p key={index} className="mb-2">
                  {line}
                </p>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <span className="text-sm text-muted-foreground">Page {currentPage} of 3</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, 3))}
                disabled={currentPage === 3}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

