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
 * @property {farmhand.cropTimetable} [cropTimetable]
 * @property {farmhand.module:enums.cropType} [cropType]
 * @property {string} [enablesFieldMode] The fieldMode that this item enables.
 * @property {string} [growsInto] The id of another farmhand.item.
 * @property {number} [hoveredPlotRange] The number to set
 * farmhand.state.hoveredPlotRange to when the item is active.
 * @property {boolean} [isPlantableCrop]
 * @property {boolean} [isReplantable]
 */

/**
 * @typedef farmhand.plotContent
 * @type {Object}
 * @property {string} itemId
 * @property {farmhand.module:enums.plotContentType} type
 */

/**
 * Represents a crop as it proceeds through the lifecycle.
 * @typedef farmhand.crop
 * @type {farmhand.plotContent}
 * @property {number} daysOld
 * @property {number} daysWatered
 * @property {boolean} isFertilized
 * @property {boolean} wasWateredToday
 */

/**
 * @typedef farmhand.notification
 * @type {Object}
 * @see
 * https://github.com/igorprado/react-notification-system#creating-a-notification
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.sass';
import Farmhand from './Farmhand';
import registerServiceWorker from './registerServiceWorker';
import 'typeface-francois-one';

ReactDOM.render(<Farmhand />, document.getElementById('root'));
registerServiceWorker();
