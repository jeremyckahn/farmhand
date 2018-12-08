import { cropIdToTypeMap, itemsMap } from './data/maps';
import Dinero from 'dinero.js';
import memoize from 'fast-memoize';
import { items as itemImages } from './img';

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
 * @param {string} itemId
 * @param {Array.<farmhand.item>} inventory
 * @returns {Array.<farmhand.item>}
 */
export const decrementItemFromInventory = (itemId, inventory) => {
  inventory = [...inventory];

  const itemInventoryIndex = inventory.findIndex(({ id }) => id === itemId);

  const { quantity } = inventory[itemInventoryIndex];

  if (quantity > 1) {
    inventory[itemInventoryIndex] = {
      ...inventory[itemInventoryIndex],
      quantity: quantity - 1,
    };
  } else {
    inventory.splice(itemInventoryIndex, 1);
  }

  return inventory;
};

/**
 * @param {farmhand.cropTimetable} cropTimetable
 * @returns {Array.<string>}
 */
export const getLifestageRange = memoize(cropTimetable =>
  ['seed', 'growing'].reduce(
    (acc, stage) => acc.concat(Array(cropTimetable[stage]).fill(stage)),
    []
  )
);

// TODO: Enum-ify the values this function returns
/**
 * @param {farmhand.item} item
 * @param {number} daysWatered
 * @returns {string}
 */
export const getCropLifeStage = (item, daysWatered) =>
  getLifestageRange(item.cropTimetable)[daysWatered] || 'grown';

/**
 * @param {farmhand.crop} crop
 * @returns {string}
 */
export const getLifeStageImageId = ({ itemId, daysWatered }) =>
  getCropLifeStage(itemsMap[itemId], daysWatered);

/**
 * @param {farmhand.crop} crop
 * @returns {?string}
 */
export const getPlotImage = crop =>
  crop
    ? getCropLifeStage(itemsMap[crop.itemId], crop.daysWatered) === 'grown'
      ? itemImages[getCropId(crop)]
      : itemImages[`${getCropId(crop)}-${getLifeStageImageId(crop)}`]
    : null;
