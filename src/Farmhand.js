import React, { Component, createRef } from 'react';
import NotificationSystem from 'react-notification-system';
import { HotKeys } from 'react-hotkeys';
import localforage from 'localforage';
import eventHandlers from './event-handlers';
import {
  addItemToInventory,
  computePlayerInventory,
  computeStateForNextDay,
  decrementItemFromInventory,
  getFieldToolInventory,
  getFinalCropItemIdFromSeedItemId,
  getPlantableInventory,
  getWateredField,
  modifyFieldPlotAt,
  removeFieldPlotAt,
} from './data-transformers';
import Navigation from './components/Navigation';
import ContextPane from './components/ContextPane';
import Stage from './components/Stage';
import DebugMenu from './components/DebugMenu';
import { createNewField, getCropFromItemId, getCropLifeStage } from './utils';
import shopInventory from './data/shop-inventory';
import { itemsMap } from './data/maps';
import { cropLifeStage, stageFocusType, fieldMode } from './enums';
import {
  FERTILIZER_ITEM_ID,
  INITIAL_FIELD_WIDTH,
  INITIAL_FIELD_HEIGHT,
} from './constants';
import { PROGRESS_SAVED_MESSAGE } from './strings';

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
 * @property {string} selectedItemId
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
    field: createNewField(),
    fieldHeight: INITIAL_FIELD_HEIGHT,
    fieldWidth: INITIAL_FIELD_WIDTH,
    inventory: [],
    money: 500,
    newDayNotifications: [],
    selectedItemId: '',
    fieldMode: fieldMode.OBSERVE,
    shopInventory: [...shopInventory],
    stageFocus: stageFocusType.FIELD,
    valueAdjustments: {},
  };

  constructor() {
    super(...arguments);

    this.initKeyHandlers();
  }

  get fieldToolInventory() {
    return getFieldToolInventory(this.state.inventory);
  }

  get playerInventory() {
    const { inventory, valueAdjustments } = this.state;
    return computePlayerInventory(inventory, valueAdjustments);
  }

  get plantableInventory() {
    return getPlantableInventory(this.state.inventory);
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
    const nextDayState = computeStateForNextDay(this.state);
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
        selectedItemId: plantableItemId,
      });
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  fertilizePlot(x, y) {
    const { field, inventory } = this.state;
    const row = field[y];
    const crop = row[x];

    if (!crop || crop.isFertilized) {
      // Nothing planted in field[x][y]
      return;
    }

    const updatedInventory = decrementItemFromInventory(
      FERTILIZER_ITEM_ID,
      inventory
    );

    const doFertilizersRemain = !!updatedInventory.find(
      item => item.id === FERTILIZER_ITEM_ID
    );

    this.setState({
      field: modifyFieldPlotAt(field, x, y, crop => ({
        ...crop,
        isFertilized: true,
      })),
      fieldMode: doFertilizersRemain ? fieldMode.FERTILIZE : fieldMode.OBSERVE,
      inventory: updatedInventory,
      selectedItemId: doFertilizersRemain ? FERTILIZER_ITEM_ID : '',
    });
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
    const {
      fieldToolInventory,
      handlers,
      keyHandlers,
      keyMap,
      notificationSystemRef,
      plantableInventory,
      playerInventory,
    } = this;

    // Bundle up the raw state and the computed state into one object to be
    // passed down through the component tree.
    const state = {
      ...this.state,
      fieldToolInventory,
      plantableInventory,
      playerInventory,
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
