/**
 * @namespace farmhand
 */

/**
 * @typedef farmhand.item
 * @type {Object}
 * @property {string} id
 * @property {string} name
 * @property {number} value
 * @property {boolean} [isPlantable]
 */

/**
 * @typedef farmhand.crop
 * @type {farmhand.item}
 * @property {farmhand.module:enums.cropType} type
 */

/**
 * @typedef farmhand.plot
 * @type {Object}
 * @property {farmhand.module:enums.cropType} cropType
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/Farmhand';
import registerServiceWorker from './registerServiceWorker';
import 'typeface-francois-one';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
