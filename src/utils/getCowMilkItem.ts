import { cowColors } from '../enums.js'
import {
  chocolateMilk,
  rainbowMilk1,
  milk1,
  rainbowMilk2,
  milk2,
  rainbowMilk3,
  milk3,
} from '../data/items.js'

export const getCowMilkItem = ({
  color,
  happiness,
}: {
  color: farmhand.cowColors
  happiness: number
}): farmhand.item => {
  if (color === cowColors.BROWN) {
    return chocolateMilk
  }

  const isRainbowCow = color === cowColors.RAINBOW

  if (happiness < 1 / 3) {
    return isRainbowCow ? rainbowMilk1 : milk1
  } else if (happiness < 2 / 3) {
    return isRainbowCow ? rainbowMilk2 : milk2
  }

  return isRainbowCow ? rainbowMilk3 : milk3
}
