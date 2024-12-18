/**
 * @namespace farmhand
 */

import './polyfills.js'
import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route } from 'react-router-dom'

import './index.sass'
import Farmhand from './components/Farmhand/index.js'
import { features } from './config.js'
import '@fontsource/francois-one'
import '@fontsource/public-sans'

// eslint-disable-next-line no-unused-vars
import { cropFamily, grapeVariety } from './enums.js'

/**
 * @typedef {import("./components/Farmhand/Farmhand").farmhand.state} farmhand.state
 */

/**
 * @typedef {import("./enums").cropType} cropType
 * @typedef {import("./enums").cowColors} cowColors
 * @typedef {import("./enums").recipeType} recipeType
 * @typedef {import("./enums").toolLevel} toolLevel
 * @typedef {import("./enums").toolType} toolType
 * @typedef {import("./enums").fertilizerType} fertilizerType
 */

/**
 * Reference object for an item.
 * @typedef farmhand.item
 * @property {string} id
 * @property {string} name
 * @property {string} type
 * @property {number} value
 * @property {Array.<number>} [cropTimeline] The number of days for each growing phase
 * @property {cropType} [cropType]
 * @property {string} [description] A user-friendly description of the item.
 * @property {string} [enablesFieldMode] The fieldMode that this item enables.
 * @property {string|Array.<string>} [growsInto] The id of farmhand.item or list of ids of other farmhand.items that this farmhand.item (likely a crop seed) will grow into.
 * @property {boolean} [doesPriceFluctuate] Whether or not this item has a value that fluctuates from day to day.
 * @property {number} [hoveredPlotRange] The number to set farmhand.state.hoveredPlotRange to when the item is active.
 * @property {boolean} [isPlantableCrop]
 * @property {boolean} [isReplantable]
 * @property {number} [quantity] How many of the item the player has.
 * @property {number} [tier] The value tier that the item belongs to.
 * @property {number?} [spawnChance] The respawn rate for the item.
 * @property {number?} [daysToFerment] This number is defined if the item can
 * be fermented.
 */

/**
 * @typedef {farmhand.item & {
 *   imageId: string,
 *   cropFamily: cropFamily,
 *   variety: string
 * }} farmhand.cropVariety

/**
 * @typedef {farmhand.cropVariety & {
 *   cropFamily: 'GRAPE',
 *   variety: grapeVariety,
 *   wineId: string
 * }} farmhand.grape
 */

/**
 * @typedef {farmhand.recipe & {
 *   variety: grapeVariety
 * }} farmhand.wine
 */

/**
 * This is a base type to be inherited and expanded on by types like
 * farmhand.crop. This also represents non-crop plot content like scarecrows
 * and sprinklers.
 * @typedef farmhand.plotContent
 * @property {string} itemId
 * @property {boolean=} isFertilized Deprecated by fertilizerType.
 * @property {fertilizerType} fertilizerType
 */

/**
 * Represents a crop as it proceeds through the lifecycle.
 * @typedef farmhand.cropType
 * @property {number} daysOld
 * @property {number} daysWatered
 * @property {boolean} wasWateredToday
 * @typedef {farmhand.plotContent & farmhand.cropType} farmhand.crop
 */

/**
 * Represents a tree
 * @typedef farmhand.plantedTree
 * @property {number} daysOld
 * @property {string} itemId
 */

/**
 * Represents a forageable item that grows in the forest
 * @typedef farmhand.forestForageable
 * @property {number} daysOld
 * @property {'mushroom' | 'acorn'} forageableId
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
 * @property {Object.<cowColors, boolean>} colorsInBloodline
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
 * @property {string} originalOwnerId
 * @property {string} ownerId
 * @property {number} timesTraded
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
 * @typedef {farmhand.item & {
 *   recipeType: recipeType, // The type of recipe of recipe this is.
 *   ingredients: Record<string, number>, // An object where each key is the id of a farmhand.item and the value is the quantity of that item.
 *   condition: farmhand.recipeCondition, // This must return `true` for the recipe to be made available to the player.
 * }} farmhand.recipe
 * @readonly
 */

/**
 * @typedef farmhand.keg
 * @type {Object}
 * @property {string} id UUID to uniquely identify the keg.
 * @property {string} itemId The item that this keg is based on.
 * @property {number} daysUntilMature Days remaining until this recipe can be
 * sold. This value can go negative to indicate "days since fermented" or "days
 * open" When negative, the value of the keg is increased.
 */

/**
 * @typedef farmhand.priceEvent
 * @type {Record<string, {itemId: string, daysRemaining: number}>}
 * @description The top-level record key and itemId values must match.
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
 * @type {Object}
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} rewardDescription
 * @property {farmhand.achievementCondition} condition
 * @property {farmhand.achievementReward} reward
 * @readonly
 */

/**
 * @typedef farmhand.level
 * @type {Object}
 * @property {number} id
 * @property {boolean} [increasesSprinklerRange]
 * @property {string} [unlocksShopItem] Must reference a farmhand.item id.
 * @readonly
 */

/**
 * @typedef farmhand.notification
 * @type {Object}
 * @property {'error'|'info'|'success'|'warning'} severity
 * @property {Function=} onClick
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
 * @typedef farmhand.offeredCow
 * @type {farmhand.cow}
 * @property {string} ownerId
 */

/**
 * @typedef farmhand.peerMetadata
 * @type {Pick<farmhand.state, 'cowsSold' | 'cropsHarvested' | 'dayCount' | 'experience' | 'id' | 'money' | 'pendingPeerMessages' | 'version'> & { cowOfferedForTrade?: farmhand.offeredCow }}
 */

/**
 * @typedef farmhand.upgradesMetadatum
 * @type {Object}
 * @property {string} id
 * @property {string?} description
 * @property {string} name
 * @property {Record<farmhand.item["id"], number>?} ingredients
 * @property {toolLevel?} nextLevel
 * @property {boolean?} isMaxLevel
 */

/**
 * @typedef farmhand.upgradesMetadata
 * @type {Object.<toolType, farmhand.upgradesMetadatum>}
 */

/**
 * @typedef {Object} farmhand.levelEntitlements
 * @property {number} sprinklerRange
 * @property {Object.<string, boolean>} items
 * @property {Object.<string, boolean>} tools
 * @property {Object.<string, boolean>} stageFocusType
 */

/**
 * @typedef {Object} farmhand.purchaseableFieldSize
 * @property {number} columns
 * @property {number} rows
 * @property {number} price
 */

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
