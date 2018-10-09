/**
 * @module farmhand.items
 */

import carrotSeedsImage from '../img/field-tiles/carrot-seeds.png';
import pumpkinSeedsImage from '../img/field-tiles/pumpkin-seeds.png';

const { freeze } = Object;

/**
 * @property farmhand.module:items.carrotSeeds
 * @type {farmhand.item}
 */
export const carrotSeeds = freeze({
  id: 'carrot-seeds',
  image: carrotSeedsImage,
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
  image: pumpkinSeedsImage,
  isPlantable: true,
  name: 'Pumpkin Seeds',
  value: 40,
});
