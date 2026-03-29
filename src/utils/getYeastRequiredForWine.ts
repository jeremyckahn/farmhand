import { wineVarietyValueMap } from '../data/crops/grape.js'
import { YEAST_REQUIREMENT_FOR_WINE_MULTIPLIER } from '../constants.js'
// eslint-disable-next-line no-unused-vars
import { grapeVariety as grapeVarietyEnum } from '../enums.js'

/**
 * @param {grapeVarietyEnum} grapeVariety
 */
export const getYeastRequiredForWine = grapeVariety => {
  return (
    wineVarietyValueMap[grapeVariety] * YEAST_REQUIREMENT_FOR_WINE_MULTIPLIER
  )
}
