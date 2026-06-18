import { cowColors } from '../enums.js'

const cowColorToIdMap: Record<farmhand.cowColors, string> = {
  [cowColors.BLUE]: 'blue',
  [cowColors.BROWN]: 'brown',
  [cowColors.GREEN]: 'green',
  [cowColors.ORANGE]: 'orange',
  [cowColors.PURPLE]: 'purple',
  [cowColors.RAINBOW]: 'rainbow',
  [cowColors.WHITE]: 'white',
  [cowColors.YELLOW]: 'yellow',
}

export const getCowColorId = ({ color }: { color: farmhand.cowColors }) =>
  `${cowColorToIdMap[color]}-cow`
