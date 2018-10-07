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
  isPlantable: true,
  name: 'Carrot Seeds',
  value: 20,
});

/**
 * @property farmhand.module:items.pumpkinSeeds
 * @type {farmhand.item}
 */
export const pumpkinSeeds = freeze({
  id: 'pumpkin-seeds',
  isPlantable: true,
  name: 'Pumpkin Seeds',
  value: 40,
});
