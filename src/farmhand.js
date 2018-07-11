import React, { Component } from 'react';
import ContextPane from './context-pane';
import Stage from './stage';

import { initialFieldWidth, initialFieldHeight } from './constants';

/**
 * @typedef famrhand.state
 * @type {Object}
 * @property {Array.<Array.<farmhand.crop|null>>} field
 */

export default class Farmhand extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      field: this.createNewField(),
    };
  }

  createNewField() {
    // FIXME: Set up Babel polyfill for Array#fill
    /* eslint-disable no-unused-vars */
    return new Array(initialFieldHeight)
      .fill(undefined)
      .map(_ => new Array(initialFieldWidth).fill(null));
    /* eslint-enable no-unused-vars */
  }

  render() {
    return (
      <div className="fill farmhand-wrapper">
        <ContextPane />
        <Stage />
      </div>
    );
  }
}
