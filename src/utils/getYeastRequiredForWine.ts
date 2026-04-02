import { wineVarietyValueMap } from '../data/crops/grape.ts'
import { YEAST_REQUIREMENT_FOR_WINE_MULTIPLIER } from '../constants.ts'
// eslint-disable-next-line no-unused-vars
import { grapeVariety as grapeVarietyEnum } from '../enums.ts'

/**
 * @param {grapeVarietyEnum} grapeVariety
 */
export const getYeastRequiredForWine = grapeVariety => {
  return (
    wineVarietyValueMap[grapeVariety] * YEAST_REQUIREMENT_FOR_WINE_MULTIPLIER
  )
}
