import { wineVarietyValueMap } from '../data/crops/grape.js'
import { YEAST_REQUIREMENT_FOR_WINE_MULTIPLIER } from '../constants.js'
// eslint-disable-next-line no-unused-vars
import { grapeVariety } from '../enums.js'

export const getYeastRequiredForWine = (variety: farmhand.grapeVariety) => {
  return wineVarietyValueMap[variety] * YEAST_REQUIREMENT_FOR_WINE_MULTIPLIER
}
