/**
 * @module farmhand.recipes
 */
import { itemType } from '../enums';

import * as items from './items';

const itemify = recipe =>
  Object.freeze({
    ...recipe,
    type: itemType.DISH,
    value:
      recipe.markup +
      Object.keys(recipe.ingredients).reduce(
        (sum, itemId) => sum + items[itemId].value * recipe.ingredients[itemId],
        0
      ),
  });

/**
 * @property farmhand.module:recipes.carrotSoup
 * @type {farmhand.recipe}
 */
export const carrotSoup = itemify({
  id: 'carrot-soup',
  name: 'Carrot Soup',
  markup: 15,
  ingredients: {
    [items.carrot.id]: 4,
  },
  condition: state => (state.itemsSold[items.carrot.id] || 0) > 3,
});
