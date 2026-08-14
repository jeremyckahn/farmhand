import { cowColors } from '../enums.js'
import { itemsMap } from '../data/maps.js'

export const getCowFertilizerItem = ({
  color,
}: {
  color: cowColors
}): farmhand.item =>
  itemsMap[color === cowColors.RAINBOW ? 'rainbow-fertilizer' : 'fertilizer']
