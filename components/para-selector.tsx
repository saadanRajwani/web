"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ParaSelectorProps {
  onParaSelect: (paraNumber: number, rukuNumber: number | null) => void
  userPara: number | null
  userParaSection: number | null
  userCompleted: boolean
  communityData: {
    sectionsCompleted: number
    totalSections: number
    // Other properties...
  }
}

// Para names (first few words of each para)
const paraNames = [
  "Alif Lam Meem",
  "Sayaqool",
  "Tilkal Rusul",
  "Lan Tana Loo",
  "Wal Mohsanat",
  "La Yuhibbullah",
  "Wa Iza Samiu",
  "Wa Lau Annana",
  "Qalal Malao",
  "Wa A'lamu",
  "Yatazeroon",
  "Wa Ma Min Da'abat",
  "Wa Ma Ubrioo",
  "Rubama",
  "Subhanallazi",
  "Qal Alam",
  "Aqtarabo",
  "Qad Aflaha",
  "Wa Qalallazina",
  "A'man Khalaq",
  "Utlu Ma Oohi",
  "Wa Manyaqnut",
  "Wa Mali",
  "Faman Azlam",
  "Elahe Yuruddo",
  "Ha'a Meem",
  "Qala Fama Khatbukum",
  "Qad Sami Allah",
  "Tabarakallazi",
  "Amma Yatasa'aloon",
]

// Number of rukus in each para
// This is an approximation - actual counts may vary by different Quran editions
const paraRukuCounts = [
  16, // Para 1
  16, // Para 2
  16, // Para 3
  14, // Para 4
  16, // Para 5
  13, // Para 6
  15, // Para 7
  12, // Para 8
  11, // Para 9
  12, // Para 10
  10, // Para 11
  12, // Para 12
  10, // Para 13
  9, // Para 14
  9, // Para 15
  7, // Para 16
  9, // Para 17
  12, // Para 18
  8, // Para 19
  8, // Para 20
  8, // Para 21
  6, // Para 22
  7, // Para 23
  9, // Para 24
  6, // Para 25
  9, // Para 26
  8, // Para 27
  8, // Para 28
  7, // Para 29
  7, // Para 30
]

export default function ParaSelector({
  onParaSelect,
  userPara,
  userParaSection,
  userCompleted,
  communityData,
}: ParaSelectorProps) {
  const [selectedPara, setSelectedPara] = useState<number | null>(null)
  const [selectedRuku, setSelectedRuku] = useState<number | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [takenParas, setTakenParas] = useState<Set<number>>(new Set())
  const [completedParas, setCompletedParas] = useState<Set<number>>(new Set())

  // Generate an array of para numbers (1-30)
  const paras = Array.from({ length: 30 }, (_, i) => i + 1)

  // Fetch para status from API
  useEffect(() => {
    async function fetchParaStatus() {
      try {
        // If user has a para, add it to the appropriate set first as a fallback
        const tempTaken = new Set<number>()
        const tempCompleted = new Set<number>()
        
        // If user has a para, add it to the appropriate set
        if (userPara) {
          if (userCompleted) {
            tempCompleted.add(userPara)
          } else {
            tempTaken.add(userPara)
          }
        }
        
        const response = await fetch('/api/sections/status')
        if (response.ok) {
          const data = await response.json()
          
          if (data.sections && Array.isArray(data.sections)) {
            console.log("Fetched para status:", data.sections);
            
            data.sections.forEach((section: any) => {
              if (section.isCompleted) {
                tempCompleted.add(section.paraNumber)
              } else if (section.isAssigned) {
                tempTaken.add(section.paraNumber)
              }
            })
          }
        }
        
        // Log the results for debugging
        console.log("Taken paras:", Array.from(tempTaken));
        console.log("Completed paras:", Array.from(tempCompleted));
        
        setTakenParas(new Set(tempTaken))
        setCompletedParas(new Set(tempCompleted))
      } catch (error) {
        console.error('Error fetching para status:', error)
      }
    }
    
    fetchParaStatus()
  }, [userPara, userCompleted])

  // Function to get button variant based on para status
  const getButtonVariant = (para: number) => {
    if (userPara === para) {
      return userCompleted ? "default" : "secondary"
    } else if (completedParas.has(para)) {
      return "default"
    } else if (takenParas.has(para)) {
      return "secondary"
    } else {
      return "ghost"
    }
  }

  // Function to get button class based on para status
  const getButtonClass = (para: number) => {
    if (userPara === para) {
      return userCompleted
        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
        : "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100"
    } else if (completedParas.has(para)) {
      return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-100"
    } else if (takenParas.has(para)) {
      return "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-800/30 border-amber-300 dark:border-amber-700 dark:text-amber-300"
    } else {
      return ""
    }
  }

  const handleParaClick = (para: number) => {
    // Only allow selection if not already taken or completed
    if (!takenParas.has(para) && !completedParas.has(para)) {
      setSelectedPara(para)
      setOpenDialog(true)
    }
  }

  const handleConfirmSelection = () => {
    if (selectedPara) {
      onParaSelect(selectedPara, selectedRuku)
      setOpenDialog(false)
      setSelectedPara(null)
      setSelectedRuku(null)
    }
  }

  // Generate ruku options for the selected para
  const getRukuOptions = (paraIndex: number) => {
    if (!paraIndex) return []

    const rukuCount = paraRukuCounts[paraIndex - 1]
    return Array.from({ length: rukuCount }, (_, i) => i + 1)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Select a Para to Read</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            <span>Your Para</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500"></div>
            <span>Taken</span>
          </div>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {paras.map((para) => (
              <Button
                key={para}
                variant={getButtonVariant(para) as any}
                className={`h-auto py-3 px-4 flex flex-col items-start text-left ${getButtonClass(para)}`}
                onClick={() => handleParaClick(para)}
                disabled={(takenParas.has(para) && userPara !== para) || completedParas.has(para)}
              >
                <span className="font-bold text-lg">Para {para}</span>
                <span className="text-xs opacity-80">{paraNames[para - 1]}</span>
                <span className="text-xs mt-1">({paraRukuCounts[para - 1]} rukus)</span>
              </Button>
            ))}
          </div>
        </ScrollArea>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Ruku</DialogTitle>
              <DialogDescription>You can read the entire para or select a specific ruku within it.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="font-medium">Para {selectedPara}</h4>
                <p className="text-sm text-muted-foreground">{selectedPara && paraNames[selectedPara - 1]}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedPara && `${paraRukuCounts[selectedPara - 1]} rukus in this para`}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Select a specific ruku (optional):</label>
                <Select onValueChange={(value) => setSelectedRuku(value ? Number.parseInt(value) : null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Entire Para" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Entire Para</SelectItem>
                    {selectedPara &&
                      getRukuOptions(selectedPara).map((ruku) => (
                        <SelectItem key={ruku} value={ruku.toString()}>
                          Ruku {ruku}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleConfirmSelection}
              >
                Confirm Selection
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

