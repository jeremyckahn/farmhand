import Dinero from 'dinero.js';
import memoize from 'fast-memoize';

import fruitNames from './data/fruit-names';
import { cropIdToTypeMap, itemsMap } from './data/maps';
import { items as itemImages } from './img';
import { cowColors, cropLifeStage, genders, itemType } from './enums';
import {
  COW_STARTING_WEIGHT_BASE,
  COW_STARTING_WEIGHT_VARIANCE,
  INITIAL_FIELD_WIDTH,
  INITIAL_FIELD_HEIGHT,
} from './constants';

const { SEED, GROWING, GROWN } = cropLifeStage;

const chooseRandom = list =>
  list[Math.floor(Math.random() * (list.length - 1))];

/**
 * @returns {string}
 */
const createUniqueId = () => btoa(Math.random() + Date.now());

/**
 * @param {number} num
 * @param {number} min
 * @param {number} max
 */
export const clampNumber = (num, min, max) =>
  num <= min ? min : num >= max ? max : num;

export const createNewField = () =>
  new Array(INITIAL_FIELD_HEIGHT)
    .fill(undefined)
    .map(() => new Array(INITIAL_FIELD_WIDTH).fill(null));

/**
 * @param {number} number
 * @returns {string} Does not include dollar sign.
 */
export const dollarAmount = number =>
  Dinero({
    amount: Math.round(number * 100),
    precision: 2,
  })
    .toUnit()
    .toFixed(2);

/**
 * @param {farmhand.item} item
 * @param {Object.<number>} valueAdjustments
 * @returns {number}
 */
export const getItemValue = ({ id }, valueAdjustments) =>
  Dinero({
    amount: Math.round(
      (valueAdjustments[id]
        ? itemsMap[id].value *
          (itemsMap[id].doesPriceFluctuate ? valueAdjustments[id] : 1)
        : itemsMap[id].value) * 100
    ),
    precision: 2,
  }).toUnit();

/**
 * @param {string} itemId
 * @returns {farmhand.crop}
 */
export const getCropFromItemId = itemId => ({
  ...getPlotContentFromItemId(itemId),
  daysOld: 0,
  daysWatered: 0,
  isFertilized: false,
  type: itemType.CROP,
  wasWateredToday: false,
});

/**
 * @param {string} itemId
 * @returns {farmhand.plotContent}
 */
export const getPlotContentFromItemId = itemId => ({
  itemId,
  type: itemsMap[itemId].type,
});

/**
 * @param {farmhand.crop} crop
 * @return {string}
 */
export const getCropId = ({ itemId }) =>
  cropIdToTypeMap[itemsMap[itemId].cropType];

/**
 * @param {farmhand.cropTimetable} cropTimetable
 * @returns {Array.<enums.cropLifeStage>}
 */
export const getLifeStageRange = memoize(cropTimetable =>
  [SEED, GROWING].reduce(
    (acc, stage) => acc.concat(Array(cropTimetable[stage]).fill(stage)),
    []
  )
);

/**
 * @param {farmhand.crop} crop
 * @returns {enums.cropLifeStage}
 */
export const getCropLifeStage = ({ itemId, daysWatered }) =>
  getLifeStageRange(itemsMap[itemId].cropTimetable)[Math.floor(daysWatered)] ||
  GROWN;

const cropLifeStageToImageSuffixMap = {
  [SEED]: 'seed',
  [GROWING]: 'growing',
};

/**
 * @param {farmhand.plotContent} plotContent
 * @returns {?string}
 */
export const getPlotImage = plotContent =>
  plotContent
    ? plotContent.type === itemType.CROP
      ? getCropLifeStage(plotContent) === GROWN
        ? itemImages[getCropId(plotContent)]
        : itemImages[
            `${getCropId(plotContent)}-${
              cropLifeStageToImageSuffixMap[getCropLifeStage(plotContent)]
            }`
          ]
      : itemImages[plotContent.itemId]
    : null;

/**
 * @param {number} rangeSize
 * @param {number} centerX
 * @param {number} centerY
 * @returns {Array.<Array.<?farmhand.plotContent>>}
 */
export const getRangeCoords = (rangeSize, centerX, centerY) => {
  const squareSize = 2 * rangeSize + 1;
  const rangeStartX = centerX - rangeSize;
  const rangeStartY = centerY - rangeSize;

  return new Array(squareSize)
    .fill()
    .map((_, y) =>
      new Array(squareSize)
        .fill()
        .map((_, x) => ({ x: rangeStartX + x, y: rangeStartY + y }))
    );
};

/**
 * @param {Object} valueAdjustments
 * @param {string} itemId
 * @returns {number}
 */
export const getAdjustedItemValue = (valueAdjustments, itemId) =>
  (valueAdjustments[itemId] || 1) * itemsMap[itemId].value;

/**
 * Generates a friendly cow.
 * @param {Object} [options]
 * @returns {farmhand.cow}
 */
export const generateCow = options => {
  const weight = Math.round(
    COW_STARTING_WEIGHT_BASE -
      COW_STARTING_WEIGHT_VARIANCE +
      Math.random() * (COW_STARTING_WEIGHT_VARIANCE * 2)
  );

  return {
    baseWeight: weight,
    color: chooseRandom(Object.values(cowColors)),
    daysOld: 1,
    gender: chooseRandom(Object.values(genders)),
    happiness: 0,
    happinessBoostsToday: 0,
    id: createUniqueId(),
    name: chooseRandom(fruitNames),
    weightMultiplier: 1,
    ...options,
  };
};

/**
 * @param {farmhand.cow} cow
 */
export const getCowWeight = ({ baseWeight, weightMultiplier }) =>
  Math.round(baseWeight * weightMultiplier);

/**
 * @param {farmhand.cow} cow
 */
export const getCowValue = cow => getCowWeight(cow) * 1.5;
