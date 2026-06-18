export const getCowWeight = ({
  baseWeight,
  weightMultiplier,
}: {
  baseWeight: number
  weightMultiplier: number
}): number => Math.round(baseWeight * weightMultiplier)
