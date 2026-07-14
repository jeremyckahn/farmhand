export const getGrowingPhaseForTimeline = (
  timeline: number[],
  daysElapsed: number
): number => {
  let daysGrowing = daysElapsed + 1
  let phase = 0

  for (const value of timeline) {
    if (daysGrowing - value <= 0) break

    daysGrowing -= value
    phase += 1
  }

  return phase
}
