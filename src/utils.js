import { cropIdToTypeMap, itemsMap } from './data/maps';
import Dinero from 'dinero.js';
import memoize from 'fast-memoize';
import { items as itemImages } from './img';
import { cropLifeStage } from './enums';
import { INITIAL_FIELD_WIDTH, INITIAL_FIELD_HEIGHT } from './constants';

const { SEED, GROWING, GROWN } = cropLifeStage;

export const createNewField = () =>
  new Array(INITIAL_FIELD_HEIGHT)
    .fill(undefined)
    .map(() => new Array(INITIAL_FIELD_WIDTH).fill(null));

/**
 * @param {farmhand.item} item
 * @param {Object.<number>} valueAdjustments
 * @returns {number}
 */
export const getItemValue = ({ id }, valueAdjustments) =>
  Dinero({
    amount: Math.round(
      (valueAdjustments[id]
        ? itemsMap[id].value * valueAdjustments[id]
        : itemsMap[id].value) * 100
    ),
    precision: 2,
  }).toUnit();

/**
 * @param {string} itemId
 * @returns {farmhand.crop}
 */
export const getCropFromItemId = itemId => ({
  daysOld: 0,
  daysWatered: 0,
  isFertilized: false,
  itemId,
  wasWateredToday: false,
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
 * @param {farmhand.crop} crop
 * @returns {?string}
 */
export const getPlotImage = crop =>
  crop
    ? getCropLifeStage(crop) === GROWN
      ? itemImages[getCropId(crop)]
      : itemImages[
          `${getCropId(crop)}-${
            cropLifeStageToImageSuffixMap[getCropLifeStage(crop)]
          }`
        ]
    : null;
