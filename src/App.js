import React, { Component, createRef } from 'react';
import NotificationSystem from 'react-notification-system';
import memoize from 'fast-memoize';
import eventHandlers from './event-handlers';
import Navigation from './components/Navigation';
import ContextPane from './components/ContextPane';
import Stage from './components/Stage';
import { getItemValue } from './utils';
import shopInventory from './data/shop-inventory';
import { itemsMap } from './data/maps';
import { stageFocusType } from './enums';
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
 * @typedef farmhand.state
 * @type {Object}
 * @property {number} dayCount
 * @property {Array.<Array.<farmhand.crop|null>>} field
 * @property {number} fieldHeight
 * @property {number} fieldWidth
 * @property {Array.<{ item: farmhand.item, quantity: number }>} inventory
 * @property {number} money
 * @property {string} selectedPlantableItemId
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
    const { dayCount } = this.state;

    this.setState({
      dayCount: dayCount + 1,
      valueAdjustments: getUpdatedValueAdjustments(),
      field: this.incrementCropAges(),
    });
  }

  /**
   * @param {?farmhand.crop} crop
   * @returns {?farmhand.crop} crop
   */
  incrementCropAge(crop) {
    return crop === null ? null : { ...crop, daysOld: crop.daysOld + 1 };
  }

  incrementCropAges() {
    return this.state.field.map(row => row.map(this.incrementCropAge));
  }

  getPlayerInventory() {
    const { inventory, valueAdjustments } = this.state;
    return computePlayerInventory(inventory, valueAdjustments);
  }

  getPlantableInventory() {
    return getPlantableInventory(this.state.inventory);
  }

  render() {
    const { handlers, notificationSystemRef } = this;
    const state = {
      ...this.state,
      plantableInventory: this.getPlantableInventory(),
      playerInventory: this.getPlayerInventory(),
    };

    return (
      <div className="App fill">
        <NotificationSystem ref={notificationSystemRef} />
        <div className="sidebar">
          <Navigation {...{ handlers, state }} />
          <ContextPane {...{ handlers, state }} />
        </div>
        <Stage {...{ handlers, state }} />
      </div>
    );
  }
}
