export const experienceNeededForLevel = (targetLevel: number): number =>
  ((targetLevel - 1) * 10) ** 2
