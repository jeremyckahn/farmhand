/** @typedef {farmhand.keg} keg */

import { v4 as uuid } from 'uuid'

import { carrot } from '../../data/crops/index.ts'

/**
 * @param {Partial<keg>} overrides
 * @returns {keg}
 */
export const getKegStub = (overrides = {}) => {
  return {
    id: uuid(),
    itemId: carrot.id,
    // @ts-expect-error
    daysUntilMature: carrot.daysToFerment ?? 0,
    ...overrides,
  }
}
