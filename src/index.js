/**
 * @namespace farmhand
 */

/**
 * @typedef farmhand.item
 * @type {Object}
 * @property {string} id
 * @property {string} name
 * @property {number} value
 * @property {farmhand.module:enums.cropType} [cropType]
 * @property {boolean} [isPlantable]
 */

/**
 * @typedef farmhand.crop
 * @type {string} itemId
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'typeface-francois-one';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
