import { itemType } from '../../enums.js'

export const itemStub = (overrides: Partial<farmhand.item>): farmhand.item => ({
  id: 'sample-item',
  name: 'Sample Item',
  type: itemType.CROP,
  value: 1,
  ...overrides,
})
