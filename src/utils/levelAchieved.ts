
export function levelAchieved(experience?: number = 0): number {
  return Math.floor(Math.sqrt(experience) / 10) + 1
}
