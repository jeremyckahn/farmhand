/** @typedef {farmhand.keg} keg */

import { v4 as uuid } from 'uuid'

import { carrot } from '../../data/crops/index.js'

/**
 * @param {Partial<keg>} overrides
 * @returns {keg}
 */
export const getKegStub = (overrides = {}) => {
  const carrotItem = carrot as farmhand.item
  return {
    id: uuid(),
    itemId: carrotItem.id,
    daysUntilMature: carrotItem.daysToFerment ?? 0,
    ...overrides,
  }
}
