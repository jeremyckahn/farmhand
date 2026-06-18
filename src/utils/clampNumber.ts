export const clampNumber = (num: number, min: number, max: number) =>
  num <= min ? min : num >= max ? max : num
