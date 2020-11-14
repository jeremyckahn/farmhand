/**
 * @module farmhand.recipes
 */
import { itemType } from '../enums'
import { RECIPE_INGREDIENT_VALUE_MULTIPLIER } from '../constants'

import * as items from './items'
import baseItemsMap from './items-map'

const itemify = recipe =>
  Object.freeze({
    ...recipe,
    type: itemType.CRAFTED_ITEM,
    value: Object.keys(recipe.ingredients).reduce(
      (sum, itemId) =>
        sum +
        RECIPE_INGREDIENT_VALUE_MULTIPLIER *
          baseItemsMap[itemId].value *
          recipe.ingredients[itemId],
      0
    ),
  })

/**
 * @property farmhand.module:recipes.carrotSoup
 * @type {farmhand.recipe}
 */
export const carrotSoup = itemify({
  id: 'carrot-soup',
  name: 'Carrot Soup',
  ingredients: {
    [items.carrot.id]: 4,
  },
  condition: state => (state.itemsSold[items.carrot.id] || 0) >= 10,
})

/**
 * @property farmhand.module:recipes.cheese
 * @type {farmhand.recipe}
 */
export const cheese = itemify({
  id: 'cheese',
  name: 'Cheese',
  ingredients: {
    [items.milk3.id]: 8,
  },
  condition: state => (state.itemsSold[items.milk3.id] || 0) >= 20,
})

/**
 * @property farmhand.module:recipes.chocolate
 * @type {farmhand.recipe}
 */
export const chocolate = itemify({
  id: 'chocolate',
  name: 'Chocolate',
  ingredients: {
    [items.chocolateMilk.id]: 10,
  },
  condition: state => (state.itemsSold[items.chocolateMilk.id] || 0) >= 25,
})

/**
 * @property farmhand.module:recipes.jackolantern
 * @type {farmhand.recipe}
 */
export const jackolantern = itemify({
  id: 'jackolantern',
  name: "Jack-o'-lantern",
  ingredients: {
    [items.pumpkin.id]: 1,
  },
  condition: state => (state.itemsSold[items.pumpkin.id] || 0) >= 50,
})

/**
 * @property farmhand.module:recipes.jackolantern
 * @type {farmhand.recipe}
 */
export const spaghetti = itemify({
  id: 'spaghetti',
  name: 'Spaghetti',
  ingredients: {
    [items.wheat.id]: 10,
    [items.tomato.id]: 2,
  },
  condition: state =>
    state.itemsSold[items.wheat.id] >= 20 &&
    state.itemsSold[items.tomato.id] >= 5,
})
