import React, { Component } from 'react';
import eventHandlers from '../event-handlers';
import ContextPane from './context-pane';
import Stage from './stage';
import { stageFocusType } from '../enums';

import { initialFieldWidth, initialFieldHeight } from '../constants';

/**
 * @typedef farmhand.state
 * @type {Object}
 * @property {Array.<Array.<farmhand.crop|null>>} field
 * @property {Object} inventory
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
    const { stageFocus } = this.state;

    return (
      <div className="fill farmhand-wrapper">
        <div className="sidebar">
          <ContextPane />
        </div>
        <Stage {...{ focusType: stageFocus }} />
      </div>
    );
  }
}
