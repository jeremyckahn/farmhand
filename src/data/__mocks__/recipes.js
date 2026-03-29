import { itemType, recipeType } from '../../enums.js'
import * as actualRecipes from '../recipes.js'

import * as items from './items.js'

Object.assign(module.exports, { ...actualRecipes })

export const sampleRecipe1 = {
  id: 'sample-recipe-1',
  name: 'Sample Recipe 1',
  ingredients: {
    [items.sampleItem1.id]: 2,
  },
  condition: state => (state.itemsSold[items.sampleItem1.id] || 0) > 2,
  value: items.sampleItem1.value * 2 + 10,
  type: itemType.CRAFTED_ITEM,
  recipeType: recipeType.KITCHEN,
}

export const sampleRecipe2 = {
  id: 'sample-recipe-2',
  name: 'Sample Recipe 2',
  ingredients: {
    [items.sampleItem1.id]: 2,
  },
  condition: state => (state.itemsSold[items.sampleItem1.id] || 0) > 2,
  value: items.sampleItem1.value * 2 + 10,
  type: itemType.CRAFTED_ITEM,
  recipeType: recipeType.KITCHEN,
}

export const sampleRecipe3 = {
  id: 'sample-recipe-3',
  name: 'Sample Recipe 3',
  ingredients: {
    [items.sampleItem1.id]: 2,
  },
  condition: state => (state.itemsSold[items.sampleItem1.id] || 0) > 2,
  value: items.sampleItem1.value * 2 + 10,
  type: itemType.CRAFTED_ITEM,
  recipeType: recipeType.KITCHEN,
}
