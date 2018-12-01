/**
 * @namespace farmhand
 */

/**
 * Lookup table for the lifecycle durations of a crop (in days).
 * @typedef farmhand.cropTimetable
 * @readonly
 * @type {Object}
 * @property {number} seed
 * @property {number} growing
 */

/**
 * Reference object for an item.
 * @typedef farmhand.item
 * @type {Object}
 * @readonly
 * @property {string} id
 * @property {string} name
 * @property {number} value
 * @property {farmhand.module:enums.cropType} [cropType]
 * @property {boolean} [isPlantable]
 * @property {farmhand.cropTimetable} [cropTimetable]
 */

/**
 * Represents a crop as it proceeds through the lifecycle.
 * @typedef farmhand.crop
 * @type {object} Object
 * @property {number} daysOld
 * @property {number} daysWatered
 * @property {string} itemId
 * @property {boolean} wasWateredToday
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.sass';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'typeface-francois-one';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
