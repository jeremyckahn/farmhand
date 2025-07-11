import { itemType } from '../../enums.js'

/**
 * @param {Partial<farmhand.item>} overrides
 * @returns {farmhand.item}
 */
export const itemStub = (overrides) => ({
  id: 'sample-item',
  name: 'Sample Item',
  type: itemType.CROP,
  value: 1,
  ...overrides,
})
