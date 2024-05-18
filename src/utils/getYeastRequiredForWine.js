import { wineVarietyValueMap } from '../data/crops/grape'
import { YEAST_REQUIREMENT_MULTIPLIER } from '../constants'
// eslint-disable-next-line no-unused-vars
import { grapeVariety as grapeVarietyEnum } from '../enums'

/**
 * @param {grapeVarietyEnum} grapeVariety
 */
export const getYeastRequiredForWine = grapeVariety => {
  return wineVarietyValueMap[grapeVariety] * YEAST_REQUIREMENT_MULTIPLIER
}
