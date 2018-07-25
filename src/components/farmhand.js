import React, { Component, createRef } from 'react';
import NotificationSystem from 'react-notification-system';
import eventHandlers from '../event-handlers';
import Navigation from './navigation';
import ContextPane from './context-pane';
import Stage from './stage';
import shopInventory from '../data/shop-inventory';
import { stageFocusType } from '../enums';

import { initialFieldWidth, initialFieldHeight } from '../constants';

/**
 * @typedef farmhand.state
 * @type {Object}
 * @property {Array.<Array.<farmhand.crop|null>>} field
 * @property {Array.<{ item: farmhand.item, amount: number }>} inventory
 * @property {number} money
 * @property {Array.<farmhand.item>} shopInventory
 * @property {farmhand.module:enums.stageFocusType} stageFocus
 */

export default class Farmhand extends Component {
  constructor() {
    super(...arguments);

    /**
     * @member farmhand.Farmhand#state
     * @type {farmhand.state}
     */
    this.state = {
      field: this.createNewField(),
      inventory: [],
      money: 500,
      shopInventory: [...shopInventory],
      stageFocus: stageFocusType.NONE,
    };

    this.notificationSystemRef = createRef();

    // Bind event handlers
    Object.keys(eventHandlers).forEach(
      method => (this[method] = eventHandlers[method].bind(this))
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
  triggerNotification(options) {
    this.notificationSystemRef.current.addNotification(
      Object.assign({ level: 'info' }, options)
    );
  }

  render() {
    const {
      state: { money, shopInventory, stageFocus },
      handleChangeView,
      handlePurchaseItem,
      notificationSystemRef,
    } = this;

    return (
      <div className="fill farmhand-wrapper">
        <NotificationSystem ref={notificationSystemRef} />
        <div className="sidebar">
          <Navigation {...{ handleChangeView, money }} />
          <ContextPane />
        </div>
        <Stage
          {...{
            focusType: stageFocus,
            handlePurchaseItem,
            money,
            shopInventory,
          }}
        />
      </div>
    );
  }
}
