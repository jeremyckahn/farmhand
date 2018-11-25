/**
 * @module farmhand.items
 */

import { cropType } from '../enums';

const { freeze } = Object;
const { CARROT, PUMPKIN } = cropType;

// TODO: Remove the concept of the "flowering" stage and just have "seed" and
// "growing" stages, ultimately ending in an implicit "grown" stage.

/**
 * @property farmhand.module:items.carrotSeeds
 * @type {farmhand.item}
 */
export const carrotSeeds = freeze({
  cropType: CARROT,
  cropTimetable: {
    germinate: 2,
    grow: 3,
    flower: 5,
  },
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
  cropType: PUMPKIN,
  cropTimetable: {
    germinate: 3,
    grow: 5,
    flower: 6,
  },
  id: 'pumpkin-seeds',
  isPlantable: true,
  name: 'Pumpkin Seeds',
  value: 40,
});
