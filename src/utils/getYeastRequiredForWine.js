import { wineVarietyValueMap } from '../data/crops/grape'
// eslint-disable-next-line no-unused-vars
import { grapeVariety as grapeVarietyEnum } from '../enums'

/**
 * @param {grapeVarietyEnum} grapeVariety
 */
export const getYeastRequiredForWine = grapeVariety => {
  return wineVarietyValueMap[grapeVariety] * 5
}
