/**
 * @namespace farmhand
 */

/**
 * @typedef farmhand.item
 * @type {Object}
 * @property {string} id
 * @property {string} name
 * @property {number} value
 */

/**
 * @typedef farmhand.crop
 * @type {farmhand.item}
 * @property {farmhand.module:enums.cropType} type
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/Farmhand';
import registerServiceWorker from './registerServiceWorker';
import 'typeface-francois-one';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
