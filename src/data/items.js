/**
 * @module farmhand.items
 */

import { cropLifeStage, cropType } from '../enums';

const { freeze } = Object;
const { CARROT, PUMPKIN } = cropType;
const { SEED, GROWING } = cropLifeStage;

/**
 * @property farmhand.module:items.carrotSeed
 * @type {farmhand.item}
 */
export const carrotSeed = freeze({
  cropType: CARROT,
  growsInto: 'carrot',
  id: 'carrot-seed',
  isPlantable: true,
  name: 'Carrot Seed',
  value: 20,
});

/**
 * @property farmhand.module:items.carrot
 * @type {farmhand.item}
 */
export const carrot = freeze({
  cropType: CARROT,
  cropTimetable: {
    [SEED]: 2,
    [GROWING]: 3,
  },
  id: 'carrot',
  name: 'Carrot',
  value: 40,
});

/**
 * @property farmhand.module:items.pumpkinSeed
 * @type {farmhand.item}
 */
export const pumpkinSeed = freeze({
  cropType: PUMPKIN,
  growsInto: 'pumpkin',
  id: 'pumpkin-seed',
  isPlantable: true,
  name: 'Pumpkin Seed',
  value: 40,
});

/**
 * @property farmhand.module:items.pumpkin
 * @type {farmhand.item}
 */
export const pumpkin = freeze({
  cropType: PUMPKIN,
  cropTimetable: {
    [SEED]: 3,
    [GROWING]: 5,
  },
  id: 'pumpkin',
  name: 'Pumpkin',
  value: 80,
});
