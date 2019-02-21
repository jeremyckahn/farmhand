import memoize from 'fast-memoize';
import { itemsMap } from './data/maps';
import { getItemValue } from './utils';
import { FERTILIZER_BONUS, RAIN_CHANCE } from './constants';
import { RAIN_MESSAGE } from './strings';
import { fieldMode } from './enums';

/**
 * @param {farmhand.state} state
 * @return {farmhand.state}
 */
export const applyRain = state => ({
  ...state,
  field: getWateredField(state.field),
  newDayNotifications: [
    ...state.newDayNotifications,
    {
      message: RAIN_MESSAGE,
    },
  ],
});

/**
 * @param {Array.<{ item: farmhand.item, quantity: number }>} inventory
 * @param {Object.<number>} valueAdjustments
 * @returns {Array.<farmhand.item>}
 */
export const computePlayerInventory = memoize((inventory, valueAdjustments) =>
  inventory.map(({ quantity, id }) => ({
    quantity,
    ...itemsMap[id],
    value: getItemValue(itemsMap[id], valueAdjustments),
  }))
);

export const getUpdatedValueAdjustments = () =>
  Object.keys(itemsMap).reduce(
    (acc, key) => ({
      [key]: Math.random() + 0.5,
      ...acc,
    }),
    {}
  );

/**
 * @param {string} seedItemId
 * @returns {string}
 */
export const getFinalCropItemIdFromSeedItemId = seedItemId =>
  itemsMap[seedItemId].growsInto;

/**
 * @param {Array.<{ item: farmhand.item }>} inventory
 * @returns {Array.<{ item: farmhand.item }>}
 */
export const getFieldToolInventory = memoize(inventory =>
  inventory
    .filter(({ id }) => {
      const { enablesFieldMode } = itemsMap[id];

      return (
        typeof enablesFieldMode === 'string' &&
        enablesFieldMode !== fieldMode.PLANT
      );
    })
    .map(({ id }) => itemsMap[id])
);

/**
 * @param {Array.<{ item: farmhand.item }>} inventory
 * @returns {Array.<{ item: farmhand.item }>}
 */
export const getPlantableInventory = memoize(inventory =>
  inventory
    .filter(({ id }) => itemsMap[id].isPlantable)
    .map(({ id }) => itemsMap[id])
);

/**
 * @param {?farmhand.crop} crop
 * @returns {?farmhand.crop}
 */
export const incrementAge = crop =>
  crop === null
    ? null
    : {
        ...crop,
        daysOld: crop.daysOld + 1,
        daysWatered:
          crop.daysWatered +
          (crop.wasWateredToday
            ? 1 + (crop.isFertilized ? FERTILIZER_BONUS : 0)
            : 0),
      };

/**
 * @param {?farmhand.crop} crop
 * @returns {?farmhand.crop}
 */
export const setWasWatered = crop =>
  crop === null ? null : { ...crop, wasWateredToday: true };

/**
 * @param {?farmhand.crop} crop
 * @returns {?farmhand.crop}
 */
export const resetWasWatered = crop =>
  crop === null ? null : { ...crop, wasWateredToday: false };

/**
 * @param {farmhand.item} item
 * @returns {Array.<{ item: farmhand.item, quantity: number }>}
 */
export const addItemToInventory = (item, inventory) => {
  const { id } = item;
  const newInventory = [...inventory];

  const currentItemSlot = inventory.findIndex(
    ({ id: itemId }) => id === itemId
  );

  if (~currentItemSlot) {
    const currentItem = inventory[currentItemSlot];

    newInventory[currentItemSlot] = {
      ...currentItem,
      quantity: currentItem.quantity + 1,
    };
  } else {
    newInventory.push({ id, quantity: 1 });
  }

  return newInventory;
};

const fieldReducer = (acc, fn) => fn(acc);

/**
 * @param {Array.<Array.<?farmhand.crop>>} field
 * @return {Array.<Array.<?farmhand.crop>>}
 */
export const getUpdatedField = field =>
  updateField(field, crop => fieldUpdaters.reduce(fieldReducer, crop));

/**
 * @param {Array.<Array.<?farmhand.crop>>} field
 * @return {Array.<Array.<?farmhand.crop>>}
 */
export const getWateredField = field => updateField(field, setWasWatered);

/**
 * @param {Array.<Array.<?farmhand.crop>>} field
 * @param {number} x
 * @param {number} y
 * @param {Function(?farmhand.crop)} modifierFn
 * @return {Array.<Array.<?farmhand.crop>>}
 */
export const modifyFieldPlotAt = (field, x, y, modifierFn) => {
  const row = [...field[y]];
  const crop = modifierFn(row[x]);
  row[x] = crop;
  const modifiedField = [...field];
  modifiedField[y] = row;

  return modifiedField;
};

/**
 * @param {Array.<Array.<?farmhand.crop>>} field
 * @param {number} x
 * @param {number} y
 * @return {Array.<Array.<?farmhand.crop>>}
 */
export const removeFieldPlotAt = (field, x, y) =>
  modifyFieldPlotAt(field, x, y, () => null);

/**
 * Invokes a function on every plot in a field.
 * @param {Array.<Array.<?farmhand.crop>>} field
 * @param {Function(?farmhand.crop)} modifierFn
 * @return {Array.<Array.<?farmhand.crop>>}
 */
export const updateField = (field, modifierFn) =>
  field.map(row => row.map(modifierFn));

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

export const fieldUpdaters = [incrementAge, resetWasWatered];

/**
 * @param {farmhand.state} state
 * @return {farmhand.state}
 */
export const applyBuffs = state =>
  [[RAIN_CHANCE, applyRain]].reduce(
    (acc, [chance, fn]) => (Math.random() <= chance ? fn(acc) : acc),
    state
  );

/**
 * @param {farmhand.state} state
 * @return {Object} A pared-down version of the provided {farmhand.state} with
 * the changed properties.
 */
export const computeStateForNextDay = state =>
  [applyBuffs].reduce((acc, fn) => fn({ ...acc }), {
    ...state,
    dayCount: state.dayCount + 1,
    field: getUpdatedField(state.field),
    valueAdjustments: getUpdatedValueAdjustments(),
  });
