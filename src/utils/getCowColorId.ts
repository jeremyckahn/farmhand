import { cowColors } from '../enums.js'

import { cowColorToIdMap } from './cowColorToIdMap.js'

export const getCowColorId = ({ color }: { color: farmhand.cowColors }) =>
  `${cowColorToIdMap[color]}-cow`
