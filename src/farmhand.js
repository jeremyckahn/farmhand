import React, { Component } from 'react';
import ContextPane from './context-pane';
import Stage from './stage';

export default class Farmhand extends Component {
  render() {
    return (
      <div className="fill farmhand-wrapper">
        <ContextPane />
        <Stage />
      </div>
    );
  }
}
