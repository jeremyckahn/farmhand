export const scaleNumber = (
  value: number,
  min: number,
  max: number,
  baseMin: number,
  baseMax: number
): number => ((value - min) * (baseMax - baseMin)) / (max - min) + baseMin
