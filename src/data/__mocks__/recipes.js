import { itemType } from '../../enums'

import * as items from './items'

Object.assign(module.exports, jest.requireActual('../recipes'))

export const sampleRecipe1 = {
  id: 'sample-recipe-1',
  name: 'Sample Recipe 1',
  ingredients: {
    [items.sampleItem1.id]: 2,
  },
  condition: state => (state.itemsSold[items.sampleItem1.id] || 0) > 2,
  value: items.sampleItem1.value * 2 + 10,
  type: itemType.CRAFTED_ITEM,
}
