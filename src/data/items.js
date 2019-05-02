/**
 * @module farmhand.items
 */

import { cropLifeStage, cropType, fieldMode, plotContentType } from '../enums';
import { SPRINKLER_RANGE } from '../constants';

const { freeze } = Object;
const { CARROT, PUMPKIN } = cropType;
const { SEED, GROWING } = cropLifeStage;

////////////////////////////////////////
//
// CROPS
//
////////////////////////////////////////

/**
 * @property farmhand.module:items.carrotSeed
 * @type {farmhand.item}
 */
export const carrotSeed = freeze({
  cropType: CARROT,
  enablesFieldMode: fieldMode.PLANT,
  growsInto: 'carrot',
  id: 'carrot-seed',
  isPlantable: true,
  name: 'Carrot Seed',
  type: plotContentType.CROP,
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
  type: plotContentType.CROP,
  value: 40,
});

/**
 * @property farmhand.module:items.pumpkinSeed
 * @type {farmhand.item}
 */
export const pumpkinSeed = freeze({
  cropType: PUMPKIN,
  enablesFieldMode: fieldMode.PLANT,
  growsInto: 'pumpkin',
  id: 'pumpkin-seed',
  isPlantable: true,
  name: 'Pumpkin Seed',
  type: plotContentType.CROP,
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
  type: plotContentType.CROP,
  value: 80,
});

////////////////////////////////////////
//
// FIELD TOOLS
//
////////////////////////////////////////

/**
 * @property farmhand.module:items.fertilizer
 * @type {farmhand.item}
 */
export const fertilizer = freeze({
  enablesFieldMode: fieldMode.FERTILIZE,
  id: 'fertilizer',
  name: 'Fertilizer',
  value: 60,
});

/**
 * @property farmhand.module:items.sprinkler
 * @type {farmhand.item}
 */
export const sprinkler = freeze({
  enablesFieldMode: fieldMode.SET_SPRINKLER,
  hoveredPlotRangeSize: SPRINKLER_RANGE,
  id: 'sprinkler',
  name: 'Sprinkler',
  type: plotContentType.SPRINKLER,
  value: 120,
});

// TODO: Implement scarecrow removal.

/**
 * @property farmhand.module:items.scarecrow
 * @type {farmhand.item}
 */
export const scarecrow = freeze({
  enablesFieldMode: fieldMode.SET_SCARECROW,
  id: 'scarecrow',
  name: 'Scarecrow',
  type: plotContentType.SCARECROW,
  value: 160,
});
