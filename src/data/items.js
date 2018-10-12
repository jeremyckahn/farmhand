/**
 * @module farmhand.items
 */

import { cropType } from '../enums';
import carrotSeedsImage from '../img/field-tiles/carrot-seeds.png';
import pumpkinSeedsImage from '../img/field-tiles/pumpkin-seeds.png';

const { freeze } = Object;
const { CARROT, PUMPKIN } = cropType;

/**
 * @property farmhand.module:items.carrotSeeds
 * @type {farmhand.item}
 */
export const carrotSeeds = freeze({
  cropType: CARROT,
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
  cropType: PUMPKIN,
  id: 'pumpkin-seeds',
  image: pumpkinSeedsImage,
  isPlantable: true,
  name: 'Pumpkin Seeds',
  value: 40,
});
