/** @typedef {import("../../index").farmhand.item} farmhand.item */

import { crop, fromSeed } from '../crop'
import { cropLifeStage, cropType } from '../../enums'

const { SEED, GROWING } = cropLifeStage

/**
 * @property farmhand.module:items.grapeSeed
 * @type {farmhand.item}
 */
export const grapeSeed = crop({
  cropType: cropType.GRAPE,
  cropTimetable: {
    [SEED]: 3,
    [GROWING]: 4,
  },
  growsInto: ['grape-green', 'grape-purple', 'grape-red'],
  id: 'grape-seed',
  name: 'Grape Seed',
  tier: 7,
})

/**
 * @property farmhand.module:items.grapeGreen
 * @type {farmhand.item}
 */
export const grapeGreen = crop({
  ...fromSeed(grapeSeed, grapeSeed.growsInto.indexOf('grape-green')),
  name: 'Green Grape',
})

/**
 * @property farmhand.module:items.grapePurple
 * @type {farmhand.item}
 */
export const grapePurple = crop({
  ...fromSeed(grapeSeed, grapeSeed.growsInto.indexOf('grape-purple')),
  name: 'Purple Grape',
})

/**
 * @property farmhand.module:items.grapeRed
 * @type {farmhand.item}
 */
export const grapeRed = crop({
  ...fromSeed(grapeSeed, grapeSeed.growsInto.indexOf('grape-red')),
  name: 'Red Grape',
})
