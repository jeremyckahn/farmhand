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
import { cropLifeStage, stageFocusType, fieldMode } from './enums';
import {
  INITIAL_FIELD_WIDTH,
  INITIAL_FIELD_HEIGHT,
  RAIN_CHANCE,
} from './constants';
import { PROGRESS_SAVED_MESSAGE, RAIN_MESSAGE } from './strings';

import './Farmhand.sass';

const { GROWN } = cropLifeStage;

/**
 * @typedef farmhand.state
 * @type {Object}
 * @property {number} dayCount
 * @property {Array.<Array.<?farmhand.crop>>} field
 * @property {number} fieldHeight
 * @property {number} fieldWidth
 * @property {Array.<{ item: farmhand.item, quantity: number }>} inventory
 * @property {number} money
 * @property {Array.<farmhand.notification>} newDayNotifications
 * @property {string} selectedPlantableItemId
 * @property {farmhand.module:enums.fieldMode} fieldMode
 * @property {Array.<farmhand.item>} shopInventory
 * @property {farmhand.module:enums.stageFocusType} stageFocus
 * @property {Object.<number>} valueAdjustments
 */

export default class Farmhand extends Component {
  // Bind event handlers
  handlers = {
    ...Object.keys(eventHandlers).reduce((acc, method) => {
      acc[method] = eventHandlers[method].bind(this);
      return acc;
    }, {}),
  };

  localforage = localforage.createInstance({
    name: 'farmhand',
    // NOTE: This should probably be determined by the package version
    // instead of being hardcoded.
    version: 1.0,
    description: 'Persisted game data for Farmhand',
  });

  notificationSystemRef = createRef();

  /**
   * @member farmhand.Farmhand#state
   * @type {farmhand.state}
   */
  state = {
    dayCount: 0,
    field: this.createNewField(),
    fieldHeight: INITIAL_FIELD_HEIGHT,
    fieldWidth: INITIAL_FIELD_WIDTH,
    inventory: [],
    money: 500,
    newDayNotifications: [],
    selectedPlantableItemId: '',
    fieldMode: fieldMode.OBSERVE,
    shopInventory: [...shopInventory],
    stageFocus: stageFocusType.FIELD,
    valueAdjustments: {},
  };

  constructor() {
    super(...arguments);

    this.initKeyHandlers();
  }

  /**
   * @param {farmhand.state} state
   * @return {farmhand.state}
   */
  static applyRain = state => ({
    ...state,
    field: Farmhand.getWateredField(state.field),
    newDayNotifications: [
      ...state.newDayNotifications,
      {
        message: RAIN_MESSAGE,
      },
    ],
  });

  /**
   * @param {farmhand.state} state
   * @return {farmhand.state}
   */
  static applyBuffs = state =>
    [[RAIN_CHANCE, Farmhand.applyRain]].reduce(
      (acc, [chance, fn]) => (Math.random() <= chance ? fn(acc) : acc),
      state
    );

  /**
   * @param {farmhand.state} state
   * @return {Object} A pared-down version of the provided {farmhand.state} with
   * the changed properties.
   */
  static computeStateForNextDay = state =>
    [Farmhand.applyBuffs].reduce((acc, fn) => fn({ ...acc }), {
      ...state,
      dayCount: state.dayCount + 1,
      field: Farmhand.getUpdatedField(state.field),
      valueAdjustments: Farmhand.getUpdatedValueAdjustments(),
    });

  /**
   * @param {Array.<{ item: farmhand.item, quantity: number }>} inventory
   * @param {Object.<number>} valueAdjustments
   * @returns {Array.<farmhand.item>}
   */
  static computePlayerInventory = memoize((inventory, valueAdjustments) =>
    inventory.map(({ quantity, id }) => ({
      quantity,
      ...itemsMap[id],
      value: getItemValue(itemsMap[id], valueAdjustments),
    }))
  );

  static getUpdatedValueAdjustments = () =>
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
  static getFinalCropItemIdFromSeedItemId = seedItemId =>
    itemsMap[seedItemId].growsInto;

  /**
   * @param {Array.<{ item: farmhand.item, quantity: number }>} inventory
   * @returns {Array.<{ item: farmhand.item, quantity: number }>}
   */
  static getPlantableInventory = memoize(inventory =>
    inventory
      .filter(({ id }) => itemsMap[id].isPlantable)
      .map(({ id }) => itemsMap[id])
  );

  /**
   * @param {?farmhand.crop} crop
   * @returns {?farmhand.crop}
   */
  static incrementAge = crop =>
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
  static setWasWatered = crop =>
    crop === null ? null : { ...crop, wasWateredToday: true };

  /**
   * @param {?farmhand.crop} crop
   * @returns {?farmhand.crop}
   */
  static resetWasWatered = crop =>
    crop === null ? null : { ...crop, wasWateredToday: false };

  /**
   * @param {farmhand.item} item
   * @returns {Array.<{ item: farmhand.item, quantity: number }>}
   */
  static addItemToInventory = (item, inventory) => {
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

  static fieldUpdaters = [Farmhand.incrementAge, Farmhand.resetWasWatered];

  static fieldReducer = (acc, fn) => fn(acc);
  /**
   * @param {Array.<Array.<?farmhand.crop>>} field
   * @return {Array.<Array.<?farmhand.crop>>}
   */
  static getUpdatedField = field =>
    Farmhand.updateField(field, crop =>
      Farmhand.fieldUpdaters.reduce(Farmhand.fieldReducer, crop)
    );

  /**
   * @param {Array.<Array.<?farmhand.crop>>} field
   * @return {Array.<Array.<?farmhand.crop>>}
   */
  static getWateredField = field =>
    Farmhand.updateField(field, Farmhand.setWasWatered);

  /**
   * @param {Array.<Array.<?farmhand.crop>>} field
   * @param {number} x
   * @param {number} y
   * @param {Function(?farmhand.crop)} modifierFn
   * @return {Array.<Array.<?farmhand.crop>>}
   */
  static modifyFieldPlotAt = (field, x, y, modifierFn) => {
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
  static removeFieldPlotAt = (field, x, y) =>
    Farmhand.modifyFieldPlotAt(field, x, y, () => null);

  /**
   * Invokes a function on every plot in a field.
   * @param {Array.<Array.<?farmhand.crop>>} field
   * @param {Function(?farmhand.crop)} modifierFn
   * @return {Array.<Array.<?farmhand.crop>>}
   */
  static updateField = (field, modifierFn) =>
    field.map(row => row.map(modifierFn));

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
        const { newDayNotifications } = state;
        this.setState({ ...state, newDayNotifications: [] }, () => {
          newDayNotifications.forEach(notification =>
            this.showNotification(notification)
          );
        });
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
    return new Array(INITIAL_FIELD_HEIGHT)
      .fill(undefined)
      .map(() => new Array(INITIAL_FIELD_WIDTH).fill(null));
  }

  /**
   * @param {farmhand.notification} options
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

  incrementDay() {
    const nextDayState = Farmhand.computeStateForNextDay(this.state);
    const pendingNotifications = [...nextDayState.newDayNotifications];

    this.setState({ ...nextDayState, newDayNotifications: [] }, () => {
      this.localforage
        .setItem('state', {
          ...this.state,

          // newDayNotifications are persisted so that they can be shown to the
          // player when the app reloads.
          newDayNotifications: pendingNotifications,
        })
        .then(() =>
          [
            { message: PROGRESS_SAVED_MESSAGE, level: 'success' },
            ...pendingNotifications,
          ].forEach(notification => this.showNotification(notification))
        )
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
    return Farmhand.computePlayerInventory(inventory, valueAdjustments);
  }

  getPlantableInventory() {
    return Farmhand.getPlantableInventory(this.state.inventory);
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
      inventory: Farmhand.addItemToInventory(item, inventory),
      money: money - value,
    });
  }

  /**
   * @param {farmhand.item} item
   */
  sellItem(item) {
    const { id, value = 0 } = item;
    const { inventory, money } = this.state;

    this.setState({
      inventory: decrementItemFromInventory(id, inventory),
      money: money + value,
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
      const finalCropItemId = Farmhand.getFinalCropItemIdFromSeedItemId(
        plantableItemId
      );

      if (row[x]) {
        // Something is already planted in field[x][y]
        return;
      }

      const newField = Farmhand.modifyFieldPlotAt(field, x, y, () =>
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
        field: Farmhand.removeFieldPlotAt(field, x, y),
        inventory: Farmhand.addItemToInventory(
          itemsMap[crop.itemId],
          inventory
        ),
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
      field: Farmhand.removeFieldPlotAt(field, x, y),
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
      field: Farmhand.modifyFieldPlotAt(field, x, y, crop => ({
        ...crop,
        wasWateredToday: true,
      })),
    });
  }

  waterAllPlots() {
    this.setState({ field: Farmhand.getWateredField(this.state.field) });
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
