/**
 * @typedef {import('../enums').grapeVariety} grapeVarietyEnum
 */

import { wineVarietyValueMap } from '../data/crops/grape'

export class WineService {
  /**
   * @private
   */
  maturityDayMultiplier = 3

  /**
   * @private
   */
  grapeRequirementMultiplier = 4

  /**
   * @param {grapeVarietyEnum} grapeVariety
   */
  getDaysToMature = grapeVariety => {
    return wineVarietyValueMap[grapeVariety] * this.maturityDayMultiplier
  }

  /**
   * @param {grapeVarietyEnum} grapeVariety
   */
  getGrapesRequiredForWine = grapeVariety => {
    return wineVarietyValueMap[grapeVariety] * this.grapeRequirementMultiplier
  }
}

export const wineService = new WineService()
