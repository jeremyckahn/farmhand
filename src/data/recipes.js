/**
 * @module farmhand.recipes
 */
import { itemType } from '../enums'
import { RECIPE_INGREDIENT_VALUE_MULTIPLIER } from '../constants'

import * as items from './items'

const itemify = recipe =>
  Object.freeze({
    ...recipe,
    type: itemType.DISH,
    value: Object.keys(recipe.ingredients).reduce(
      (sum, itemId) =>
        sum +
        RECIPE_INGREDIENT_VALUE_MULTIPLIER *
          items[itemId].value *
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
