import React, { Component, createRef } from 'react';
import NotificationSystem from 'react-notification-system';
import memoize from 'fast-memoize';
import { HotKeys } from 'react-hotkeys';
import localforage from 'localforage';
import eventHandlers from './event-handlers';
import Navigation from './components/Navigation';
import ContextPane from './components/ContextPane';
import Stage from './components/Stage';
import DebugMenu from './components/DebugMenu';
import {
  decrementItemFromInventory,
  getCropFromItemId,
  getCropLifeStage,
  getItemValue,
} from './utils';
import shopInventory from './data/shop-inventory';
import { itemsMap } from './data/maps';
import { cropLifeStage, stageFocusType, toolType } from './enums';
import { initialFieldWidth, initialFieldHeight } from './constants';

import './Farmhand.sass';

const { GROWN } = cropLifeStage;

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
 * @param {Array.<{ item: farmhand.item, quantity: number }>} inventory
 * @returns {Array.<{ item: farmhand.item, quantity: number }>}
 */
export const getPlantableInventory = memoize(inventory =>
  inventory
    .filter(({ id }) => itemsMap[id].isPlantable)
    .map(({ id }) => itemsMap[id])
);

/**
 * Invokes a function on every plot in a field.
 * @param {Array.<Array.<?farmhand.crop>>} field
 * @param {Function(?farmhand.crop)} modifierFn
 * @return {Array.<Array.<?farmhand.crop>>}
 */
const updateField = (field, modifierFn) =>
  field.map(row => row.map(modifierFn));

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
        daysWatered: crop.daysWatered + Number(crop.wasWateredToday),
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

const fieldUpdaters = [incrementAge, resetWasWatered];
const fieldReducer = (acc, fn) => fn(acc);
/**
 * @param {Array.<Array.<?farmhand.crop>>} field
 * @return {Array.<Array.<?farmhand.crop>>}
 */
const getUpdatedField = field =>
  updateField(field, crop => fieldUpdaters.reduce(fieldReducer, crop));

/**
 * @param {Array.<Array.<?farmhand.crop>>} field
 * @return {Array.<Array.<?farmhand.crop>>}
 */
const getWateredField = field => updateField(field, setWasWatered);

/**
 * @param {Array.<Array.<?farmhand.crop>>} field
 * @param {number} x
 * @param {number} y
 * @param {Function(?farmhand.crop)} modifierFn
 * @return {Array.<Array.<?farmhand.crop>>}
 */
const modifyFieldPlotAt = (field, x, y, modifierFn) => {
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
const removeFieldPlotAt = (field, x, y) =>
  modifyFieldPlotAt(field, x, y, () => null);

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

/**
 * @typedef farmhand.state
 * @type {Object}
 * @property {number} dayCount
 * @property {Array.<Array.<?farmhand.crop>>} field
 * @property {number} fieldHeight
 * @property {number} fieldWidth
 * @property {Array.<{ item: farmhand.item, quantity: number }>} inventory
 * @property {number} money
 * @property {string} selectedPlantableItemId
 * @property {farmhand.module:enums.toolType} selectedTool
 * @property {Array.<farmhand.item>} shopInventory
 * @property {farmhand.module:enums.stageFocusType} stageFocus
 * @property {Object.<number>} valueAdjustments
 */

export default class Farmhand extends Component {
  /**
   * @member farmhand.Farmhand#state
   * @type {farmhand.state}
   */
  state = {
    dayCount: 0,
    field: this.createNewField(),
    fieldHeight: initialFieldHeight,
    fieldWidth: initialFieldWidth,
    inventory: [],
    money: 500,
    selectedPlantableItemId: '',
    selectedTool: toolType.NONE,
    shopInventory: [...shopInventory],
    stageFocus: stageFocusType.FIELD,
    valueAdjustments: {},
  };

  constructor() {
    super(...arguments);

    this.notificationSystemRef = createRef();
    const handlers = (this.handlers = {});

    // Bind event handlers
    Object.keys(eventHandlers).forEach(
      method => (handlers[method] = eventHandlers[method].bind(this))
    );

    this.initKeyHandlers();

    this.localforage = localforage.createInstance({
      name: 'farmhand',
      // NOTE: This should probably be determined by the package version
      // instead of being hardcoded.
      version: 1.0,
      description: 'Persisted game data for Farmhand',
    });
  }

  initKeyHandlers() {
    this.keyMap = {
      focusField: 'f',
      focusInventory: 'i',
      focusShop: 's',
      incrementDay: 'c',
    };

    this.keyHandlers = {
      focusField: () => this.setState({ stageFocus: stageFocusType.FIELD }),
      focusInventory: () =>
        this.setState({ stageFocus: stageFocusType.INVENTORY }),
      focusShop: () => this.setState({ stageFocus: stageFocusType.SHOP }),
      incrementDay: () => this.incrementDay(),
    };

    if (process.env.NODE_ENV === 'development') {
      Object.assign(this.keyMap, {
        clearPersistedData: 'shift+c',
        waterAllPlots: 'w',
      });

      Object.assign(this.keyHandlers, {
        clearPersistedData: () => this.clearPersistedData(),
        waterAllPlots: () => this.waterAllPlots(),
      });
    }

    this.keyHandlers = Object.keys(this.keyHandlers).reduce((acc, key) => {
      const original = this.keyHandlers[key];
      const { activeElement } = document;

      acc[key] = (...args) =>
        // If user is not focused on an input element
        (activeElement.nodeName === 'INPUT' &&
          !activeElement.classList.contains('hotkeys')) ||
        original(...args);

      return acc;
    }, {});
  }

  componentDidMount() {
    this.localforage.getItem('state').then(state => {
      if (state) {
        this.setState(state);
      } else {
        this.incrementDay();
      }
    });
  }

  clearPersistedData() {
    this.localforage.clear().then(() =>
      this.showNotification({
        message: 'localforage.clear() succeeded!',
        level: 'success',
      })
    );
  }

  createNewField() {
    return new Array(initialFieldHeight)
      .fill(undefined)
      .map(() => new Array(initialFieldWidth).fill(null));
  }

  /**
   * @param {Object} options
   * @see
   * {@link https://github.com/igorprado/react-notification-system#creating-a-notification}
   * for available options.
   */
  showNotification(options) {
    const { current: notificationSystem } = this.notificationSystemRef;

    // This will be null for the tests, so just return early.
    if (!notificationSystem) {
      return;
    }

    notificationSystem.addNotification({
      level: 'info',
      ...options,
    });
  }

  computeStateForNextDay() {
    const { dayCount, field } = this.state;

    return {
      dayCount: dayCount + 1,
      valueAdjustments: getUpdatedValueAdjustments(),
      field: getUpdatedField(field),
    };
  }

  incrementDay() {
    this.setState(this.computeStateForNextDay(), () => {
      this.localforage
        .setItem('state', this.state)
        .then(() => this.showNotification({ message: 'Progress saved!' }))
        .catch(e => {
          console.error(e);

          this.showNotification({
            message: JSON.stringify(e),
            level: 'error',
          });
        });
    });
  }

  getPlayerInventory() {
    const { inventory, valueAdjustments } = this.state;
    return computePlayerInventory(inventory, valueAdjustments);
  }

  getPlantableInventory() {
    return getPlantableInventory(this.state.inventory);
  }

  /**
   * @param {farmhand.item} item
   */
  purchaseItem(item) {
    const { value = 0 } = item;
    const { inventory, money } = this.state;

    if (value > money) {
      return;
    }

    this.setState({
      inventory: addItemToInventory(item, inventory),
      money: money - value,
    });
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {string} plantableItemId
   */
  plantInPlot(x, y, plantableItemId) {
    const { field, inventory } = this.state;

    if (plantableItemId) {
      const row = field[y];
      const finalCropItemId = getFinalCropItemIdFromSeedItemId(plantableItemId);

      if (row[x]) {
        // Something is already planted in field[x][y]
        return;
      }

      const newField = modifyFieldPlotAt(field, x, y, () =>
        getCropFromItemId(finalCropItemId)
      );

      const updatedInventory = decrementItemFromInventory(
        plantableItemId,
        inventory
      );

      plantableItemId = updatedInventory.find(
        ({ id }) => id === plantableItemId
      )
        ? plantableItemId
        : '';

      this.setState({
        field: newField,
        inventory: updatedInventory,
        selectedPlantableItemId: plantableItemId,
      });
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  harvestPlot(x, y) {
    const { inventory, field } = this.state;
    const row = field[y];
    const crop = row[x];

    if (!crop) {
      // Nothing planted in field[x][y]
      return;
    }

    if (getCropLifeStage(crop) === GROWN) {
      this.setState({
        field: removeFieldPlotAt(field, x, y),
        inventory: addItemToInventory(itemsMap[crop.itemId], inventory),
      });
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  clearPlot(x, y) {
    const { field } = this.state;
    const row = field[y];
    const crop = row[x];

    if (!crop) {
      // Nothing planted in field[x][y]
      return;
    }

    this.setState({
      field: removeFieldPlotAt(field, x, y),
    });
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  waterPlot(x, y) {
    const { field } = this.state;
    const row = field[y];

    if (!row[x]) {
      // Nothing planted in field[x][y]
      return;
    }

    this.setState({
      field: modifyFieldPlotAt(field, x, y, crop => ({
        ...crop,
        wasWateredToday: true,
      })),
    });
  }

  waterAllPlots() {
    this.setState({ field: getWateredField(this.state.field) });
  }

  render() {
    const { handlers, keyHandlers, keyMap, notificationSystemRef } = this;
    const state = {
      ...this.state,
      plantableInventory: this.getPlantableInventory(),
      playerInventory: this.getPlayerInventory(),
    };

    return (
      <HotKeys className="hotkeys" keyMap={keyMap} handlers={keyHandlers}>
        <div className="Farmhand fill">
          <NotificationSystem ref={notificationSystemRef} />
          <div className="sidebar">
            <Navigation {...{ handlers, state }} />
            <ContextPane {...{ handlers, state }} />
            {process.env.NODE_ENV === 'development' && (
              <DebugMenu {...{ handlers, state }} />
            )}
          </div>
          <Stage {...{ handlers, state }} />
        </div>
      </HotKeys>
    );
  }
}
