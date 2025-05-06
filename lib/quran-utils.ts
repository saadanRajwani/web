// Calculate the progress percentage based on current position and reading unit
export function calculateProgress(
  currentPosition: { juz: number; ruku: number; completed: number },
  readingUnit: "juz" | "ruku",
): number {
  const totalUnits = readingUnit === "juz" ? 30 : 240
  const currentUnit = readingUnit === "juz" ? currentPosition.juz : currentPosition.ruku

  // Calculate percentage (current position - 1 because we're 0-indexed for calculation)
  return ((currentUnit - 1) / totalUnits) * 100
}

// Calculate reading plan details based on user selections
export function getReadingPlan(
  readingUnit: "juz" | "ruku",
  unitsPerSession: number,
  goalType: "day" | "week" | "month",
): { sessionsRequired: number; estimatedCompletion: string } {
  const totalUnits = readingUnit === "juz" ? 30 : 240

  // Calculate how many sessions needed to complete the Quran
  const totalSessions = Math.ceil(totalUnits / unitsPerSession)

  // Calculate sessions per day/week/month based on goal type
  let sessionsRequired: number
  let timeUnit: string
  let estimatedDays: number

  switch (goalType) {
    case "day":
      sessionsRequired = totalSessions > 30 ? Math.ceil(totalSessions / 30) : 1
      timeUnit = "days"
      estimatedDays = Math.ceil(totalSessions / sessionsRequired)
      break
    case "week":
      sessionsRequired = totalSessions > 4 ? Math.ceil(totalSessions / 4) : 1
      timeUnit = "weeks"
      estimatedDays = Math.ceil(totalSessions / sessionsRequired) * 7
      break
    case "month":
      sessionsRequired = 1
      timeUnit = "month"
      estimatedDays = totalSessions * 30
      break
    default:
      sessionsRequired = 1
      timeUnit = "month"
      estimatedDays = totalSessions * 30
  }

  // Format the estimated completion time
  let estimatedCompletion: string
  if (estimatedDays <= 1) {
    estimatedCompletion = "1 day"
  } else if (estimatedDays <= 7) {
    estimatedCompletion = `${estimatedDays} days`
  } else if (estimatedDays <= 30) {
    const weeks = Math.ceil(estimatedDays / 7)
    estimatedCompletion = `${weeks} week${weeks > 1 ? "s" : ""}`
  } else {
    const months = Math.ceil(estimatedDays / 30)
    estimatedCompletion = `${months} month${months > 1 ? "s" : ""}`
  }

  return {
    sessionsRequired,
    estimatedCompletion,
  }
}

