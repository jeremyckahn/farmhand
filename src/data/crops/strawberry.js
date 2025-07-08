/** @typedef {farmhand.item} item */

import { crop, fromSeed } from '../crop.js'
import { cropType, itemType } from '../../enums.js'

/**
 * @property farmhand.module:items.strawberrySeed
 * @type {farmhand.item}
 */
export const strawberrySeed = crop(
  /** @type {farmhand.item} */ ({
    cropType: cropType.STRAWBERRY,
    cropTimeline: [6, 2],
    growsInto: 'strawberry',
    id: 'strawberry-seed',
    name: 'Strawberry Seed',
    tier: 5,
    type: itemType.CROP,
    value: 10,
  })
)

/**
 * @property farmhand.module:items.strawberry
 * @type {farmhand.item}
 */
export const strawberry = crop(
  /** @type {farmhand.item} */ ({
    ...fromSeed(/** @type {farmhand.seedItem} */ (strawberrySeed)),
    name: 'Strawberry',
  })
)
