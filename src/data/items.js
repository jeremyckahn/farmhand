/**
 * @module farmhand.items
 */

const { freeze } = Object;

/**
 * @property farmhand.module:items.carrotSeeds
 * @type {farmhand.item}
 */
export const carrotSeeds = freeze({
  id: 'carrot-seeds',
  name: 'Carrot Seeds',
  value: 20,
});

/**
 * @property farmhand.module:items.pumpkinSeeds
 * @type {farmhand.item}
 */
export const pumpkinSeeds = freeze({
  id: 'pumpkin-seeds',
  name: 'Pumpkin Seeds',
  value: 40,
});
