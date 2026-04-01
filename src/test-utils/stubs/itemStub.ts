import { itemType } from '../../enums.ts'

/**
 * @param {Partial<farmhand.item>} overrides
 * @returns {farmhand.item}
 */
export const itemStub = overrides => ({
  id: 'sample-item',
  name: 'Sample Item',
  type: itemType.CROP,
  value: 1,
  ...overrides,
})
