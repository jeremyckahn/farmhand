/**
 * @module farmhand.recipes
 */

import * as items from './items';

const { freeze } = Object;

/**
 * @property farmhand.module:recipes.carrotSoup
 * @type {farmhand.recipe}
 */
export const carrotSoup = freeze({
  id: 'carrot-soup',
  name: 'Carrot Soup',
  markup: 15,
  ingredients: {
    [items.carrot.id]: 4,
  },
});
