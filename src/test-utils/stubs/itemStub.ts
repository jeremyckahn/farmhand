import { itemType } from '../../enums.js'


export const itemStub = overrides => ({
  id: 'sample-item',
  name: 'Sample Item',
  type: itemType.CROP,
  value: 1,
  ...overrides,
})
