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
  yeastRequirementMultiplier = 5

  /**
   * @param {grapeVarietyEnum} grapeVariety
   */
  getDaysToMature = grapeVariety => {
    return wineVarietyValueMap[grapeVariety] * this.maturityDayMultiplier
  }

  /**
   * @param {grapeVarietyEnum} grapeVariety
   */
  getYeastRequiredForWine = grapeVariety => {
    return wineVarietyValueMap[grapeVariety] * this.yeastRequirementMultiplier
  }
}

export const wineService = new WineService()
