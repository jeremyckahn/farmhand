import { itemType, recipeType } from '../../enums'

import * as items from './items'

Object.assign(module.exports, jest.requireActual('../recipes'))

export const sampleRecipe1 = {
  playerId: 'sample-recipe-1',
  name: 'Sample Recipe 1',
  ingredients: {
    [items.sampleItem1.playerId]: 2,
  },
  condition: state => (state.itemsSold[items.sampleItem1.playerId] || 0) > 2,
  value: items.sampleItem1.value * 2 + 10,
  type: itemType.CRAFTED_ITEM,
  recipeType: recipeType.KITCHEN,
}

export const sampleRecipe2 = {
  playerId: 'sample-recipe-2',
  name: 'Sample Recipe 2',
  ingredients: {
    [items.sampleItem1.playerId]: 2,
  },
  condition: state => (state.itemsSold[items.sampleItem1.playerId] || 0) > 2,
  value: items.sampleItem1.value * 2 + 10,
  type: itemType.CRAFTED_ITEM,
  recipeType: recipeType.KITCHEN,
}

export const sampleRecipe3 = {
  playerId: 'sample-recipe-3',
  name: 'Sample Recipe 3',
  ingredients: {
    [items.sampleItem1.playerId]: 2,
  },
  condition: state => (state.itemsSold[items.sampleItem1.playerId] || 0) > 2,
  value: items.sampleItem1.value * 2 + 10,
  type: itemType.CRAFTED_ITEM,
  recipeType: recipeType.KITCHEN,
}
