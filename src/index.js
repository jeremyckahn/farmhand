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
 * @property {string} type
 * @property {farmhand.cropTimetable} [cropTimetable]
 * @property {farmhand.module:enums.cropType} [cropType]
 * @property {string} [enablesFieldMode] The fieldMode that this item enables.
 * @property {string} [growsInto] The id of another farmhand.item.
 * @property {boolean} [doesPriceFluctuate] Whether or not this item has a
 * value that fluctuates from day to day.
 * @property {number} [hoveredPlotRange] The number to set.
 * farmhand.state.hoveredPlotRange to when the item is active.
 * @property {boolean} [isPlantableCrop]
 * @property {boolean} [isReplantable]
 * @property {number} [quanitity] How many of the item the player has.
 */

/**
 * This is a minimalist base type to be inherited and expanded on by types like
 * farmhand.crop. This also represents non-crop plot content like scarecrows
 * and sprinklers.
 * @typedef farmhand.plotContent
 * @type {Object}
 * @property {string} itemId
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

// Note: At some point farmhand.cow will be abstracted to farmhand.animal, but
// there's only one animal so far so the abstraction isn't helpful yet.
/**
 * @typedef farmhand.cow
 * @type {Object}
 * @property {number} baseWeight
 * @property {number} daysOld
 * @property {number} happiness 0-1.
 * @property {number} happinessBoostsToday
 * @property {string} name
 * @property {number} weightMultiplier Clamped between 0.5 and 1.5.
 */

/**
 * @callback farmhand.recipeCondition
 * @param {farmhand.state} state
 * @returns {boolean}
 */

/**
 * @typedef farmhand.recipe
 * @readonly
 * @type {farmhand.item}
 * @property {number} markup The additional value on top of the sum total of
 * the standardized ingredient cost.
 * @property {{[farmhand.item.id]: number}} ingredients An object where each
 * key is the id of a farmhand.item and the value is the quantity of that item.
 * @property {farmhand.recipeCondition} condition This must return `true` for
 * the recipe to be made available to the player.
 */

import React from 'react'
import ReactDOM from 'react-dom'

import './index.sass'
import Farmhand from './Farmhand'
import 'typeface-francois-one'
import 'typeface-public-sans'

ReactDOM.render(<Farmhand />, document.getElementById('root'))
