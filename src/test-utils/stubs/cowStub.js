/** @typedef {import('../../index').farmhand.cow} farmhand.cow */

import { generateCow } from '../../utils/index.js'

/**
 * @param {Partial<farmhand.cow>?} overrides
 */
export const getCowStub = (overrides = {}) => {
  const cow = generateCow({
    baseWeight: 1000,
    ...overrides,
  })

  return cow
}
