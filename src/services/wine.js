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
   * @param {grapeVarietyEnum} grapeVariety
   */
  getDaysToMature = grapeVariety => {
    return wineVarietyValueMap[grapeVariety] * this.maturityDayMultiplier
  }
}

export const wineService = new WineService()
