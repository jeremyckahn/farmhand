import { itemType } from '../../enums'

import * as items from './items'

export const sampleRecipe1 = {
  id: 'sample-recipe-1',
  name: 'Sample Recipe 1',
  markup: 10,
  ingredients: {
    [items.sampleItem1.id]: 2,
  },
  condition: state => (state.itemsSold[items.sampleItem1.id] || 0) > 2,
  value: items.sampleItem1.value * 2 + 10,
  type: itemType.DISH,
}
