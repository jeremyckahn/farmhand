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
 * @property {string} type
 * @property {farmhand.cropTimetable} [cropTimetable]
 * @property {farmhand.module:enums.cropType} [cropType]
 * @property {string} [description] A user-friendly description of the item.
 * @property {string} [enablesFieldMode] The fieldMode that this item enables.
 * @property {string} [growsInto] The id of another farmhand.item.
 * @property {boolean} [doesPriceFluctuate] Whether or not this item has a
 * value that fluctuates from day to day.
 * @property {number} [hoveredPlotRange] The number to set.
 * farmhand.state.hoveredPlotRange to when the item is active.
 * @property {boolean} [isPlantableCrop]
 * @property {boolean} [isReplantable]
 * @property {number} [quantity] How many of the item the player has.
 * @property {number} [tier] The value tier that the item belongs to.
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
 * @property {boolean?} isFertilized Deprecated by fertilizerType.
 * @property {farmhand.module:enums.fertilizerType} fertilizerType
 * @property {boolean} wasWateredToday
 */

/**
 * Represents a shoveled plot
 * @typedef farmhand.shoveledPlot
 * @type {Object}
 * @property {boolean} isShoveled
 * @property {number}  daysUntilClear
 * @property {string?} oreId Only exists if ore was spawned
 */

// Note: At some point farmhand.cow will be abstracted to farmhand.animal, but
// there's only one animal so far so the abstraction isn't helpful yet.
/**
 * @typedef farmhand.cow
 * @type {Object}
 * @property {number} baseWeight
 * @property {string} color
 * @property {Object.<farmhand.module:enums.cowColors, boolean>} colorsInBloodline
 * @property {number} daysOld
 * @property {number} daysSinceMilking Only applies to female cows.
 * @property {number} daysSinceProducingFertilizer Only applies to male cows.
 * @property {string} gender
 * @property {number} happiness 0-1.
 * @property {number} happinessBoostsToday
 * @property {string} id
 * @property {boolean} isBred
 * @property {boolean} isUsingHuggingMachine
 * @property {string} name
 * @property {string?} originalOwnerId
 * @property {string?} ownerId
 * @property {number} weightMultiplier Clamped between 0.5 and 1.5.
 */

/**
 * @typedef farmhand.cowBreedingPen
 * @type {Object}
 * @property {string?} cowId1
 * @property {string?} cowId2
 * @property {number} daysUntilBirth
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
 * @property {farmhand.module:enums.recipeType} recipeType The type of recipe
 * this is.
 * @property {{string: number}} ingredients An object where each
 * key is the id of a farmhand.item and the value is the quantity of that item.
 * @property {farmhand.recipeCondition} condition This must return `true` for
 * the recipe to be made available to the player.
 */

/**
 * @typedef farmhand.priceEvent
 * @type {Object}
 * @property {string} itemId
 * @property {number} daysRemaining
 */

/**
 * @callback farmhand.achievementCondition
 * @param {farmhand.state} state
 * @param {farmhand.state} prevState
 * @returns {boolean}
 */

/**
 * @callback farmhand.achievementReward
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */

/**
 * @typedef farmhand.achievement
 * @readonly
 * @type {Object}
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} rewardDescription
 * @property {farmhand.achievementCondition} condition
 * @property {farmhand.achievementReward} reward
 */

/**
 * @typedef farmhand.level
 * @readonly
 * @type {Object}
 * @property {number} id
 * @property {boolean} [increasesSprinklerRange]
 * @property {string} [unlocksShopItem] Must reference a farmhand.item id.
 */

/**
 * @typedef farmhand.notification
 * @type {Object}
 * @property {'error'|'info'|'success'|'warning'} severity
 * @property {Function?} onClick
 * @property {string} message
 */

/**
 * @typedef farmhand.peerMessage
 * @type {Object}
 * @property {string} id The farmhand.state.id of the peer.
 * @property {'error'|'info'|'success'|'warning'} severity
 * @property {string} message
 */

/**
 * @typedef farmhand.upgradesMetadatum
 * @type {Object}
 * @property {string} id
 * @property {string?} description
 * @property {string} name
 * @property {Object.<farmhand.item.id, number>?} ingredients
 * @property {farmhand.module:enums.toolLevel?} nextLevel
 * @property {boolean?} isMaxLevel
 */

/**
 * @typedef farmhand.upgradesMetadata
 * @type {Object.<farmhand.module:enums.toolType, farmhand.upgradesMetadatum>}
 */

import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route } from 'react-router-dom'

import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import './index.sass'
import Farmhand from './Farmhand'
import { features } from './config'
import 'typeface-francois-one'
import 'typeface-public-sans'

const FarmhandRoute = props => <Farmhand {...{ ...props, features }} />

ReactDOM.render(
  <Router
    {...{
      hashType: 'noslash',
    }}
  >
    <Route
      {...{
        path: ['/online/:room', '/online', '/'],
        component: FarmhandRoute,
      }}
    />
  </Router>,
  document.getElementById('root')
)

serviceWorkerRegistration.register()
