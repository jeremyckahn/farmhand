import React, { Component } from 'react';
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
 * @property {Object} inventory
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
      inventory: {},
      shopInventory: [...shopInventory],
      stageFocus: stageFocusType.NONE,
    };

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

  render() {
    const {
      state: { shopInventory, stageFocus },
      handleChangeView,
    } = this;

    return (
      <div className="fill farmhand-wrapper">
        <div className="sidebar">
          <Navigation {...{ handleChangeView }} />
          <ContextPane />
        </div>
        <Stage {...{ focusType: stageFocus, shopInventory }} />
      </div>
    );
  }
}
