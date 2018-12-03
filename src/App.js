import React, { Component, createRef } from 'react';
import NotificationSystem from 'react-notification-system';
import memoize from 'fast-memoize';
import { HotKeys } from 'react-hotkeys';
import eventHandlers from './event-handlers';
import Navigation from './components/Navigation';
import ContextPane from './components/ContextPane';
import Stage from './components/Stage';
import {
  decrementItemFromInventory,
  getCropFromItemId,
  getItemValue,
} from './utils';
import shopInventory from './data/shop-inventory';
import { itemsMap } from './data/maps';
import { stageFocusType, toolType } from './enums';
import { initialFieldWidth, initialFieldHeight } from './constants';

import './App.sass';

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
 * @param {Array.<{ item: farmhand.item, quantity: number }>} inventory
 * @returns {Array.<{ item: farmhand.item, quantity: number }>}
 */
export const getPlantableInventory = memoize(inventory =>
  inventory
    .filter(({ id }) => itemsMap[id].isPlantable)
    .map(({ id }) => itemsMap[id])
);

/**
 * @param {?farmhand.crop} crop
 * @returns {?farmhand.crop} crop
 */
export const incrementCropAge = crop =>
  crop === null
    ? null
    : {
        ...crop,
        daysOld: crop.daysOld + 1,
        daysWatered: crop.daysWatered + Number(crop.wasWateredToday),
      };

/**
 * @param {Array.<Array.<?farmhand.crop>>} field
 * @return {Array.<Array.<?farmhand.crop>>}
 */
export const incrementedFieldAge = field =>
  field.map(row => row.map(incrementCropAge));

/**
 * @param {Array.<Array.<?farmhand.crop>>} field
 * @return {Array.<Array.<?farmhand.crop>>}
 */
export const resetFieldWasWateredState = field =>
  field.map(row =>
    row.map(
      plot => (plot === null ? null : { ...plot, wasWateredToday: false })
    )
  );

/**
 * @param {Array.<Array.<?farmhand.crop>>} field
 * @param {number} x
 * @param {number} y
 * @param {Function(?farmhand.crop)} modifierFn
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

export default class App extends Component {
  /**
   * @member farmhand.App#state
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
  }

  initKeyHandlers() {
    this.keyMap = {
      focusField: 'f',
      focusInventory: 'i',
      focusShop: 's',
    };

    this.keyHandlers = {
      focusField: () => this.setState({ stageFocus: stageFocusType.FIELD }),
      focusInventory: () =>
        this.setState({ stageFocus: stageFocusType.INVENTORY }),
      focusShop: () => this.setState({ stageFocus: stageFocusType.SHOP }),
    };

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
    this.incrementDay();
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
  triggerNotification(options) {
    this.notificationSystemRef.current.addNotification({
      level: 'info',
      ...options,
    });
  }

  incrementDay() {
    const { dayCount, field } = this.state;

    this.setState({
      dayCount: dayCount + 1,
      valueAdjustments: getUpdatedValueAdjustments(),
      field: resetFieldWasWateredState(incrementedFieldAge(field)),
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
   * @param {number} x
   * @param {number} y
   * @param {string} plantableItemId
   */
  plantInPlot(x, y, plantableItemId) {
    const { field, inventory } = this.state;

    if (plantableItemId) {
      const row = field[y];

      if (row[x]) {
        // Something is already planted in field[x][y]
        return;
      }

      const newField = modifyFieldPlotAt(field, x, y, () =>
        getCropFromItemId(plantableItemId)
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
  waterPlot(x, y) {
    // TODO: Consolidate the similar logic between this method and plantInPlot
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

  render() {
    const { handlers, keyHandlers, keyMap, notificationSystemRef } = this;
    const state = {
      ...this.state,
      plantableInventory: this.getPlantableInventory(),
      playerInventory: this.getPlayerInventory(),
    };

    return (
      <HotKeys className="hotkeys" keyMap={keyMap} handlers={keyHandlers}>
        <div className="App fill">
          <NotificationSystem ref={notificationSystemRef} />
          <div className="sidebar">
            <Navigation {...{ handlers, state }} />
            <ContextPane {...{ handlers, state }} />
          </div>
          <Stage {...{ handlers, state }} />
        </div>
      </HotKeys>
    );
  }
}
