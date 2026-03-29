import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.garlicSeed
 * @type {farmhand.item}
 */
export const garlicSeed = crop({
  cropType: cropType.GARLIC,
  cropTimeline: [2, 1, 1, 1],
  growsInto: 'garlic',
  id: 'garlic-seed',
  name: 'Garlic Bulb',
  tier: 5,
})

/**
 * @property farmhand.module:items.garlic
 * @type {farmhand.item}
 */
// @ts-expect-error
export const garlic = crop({
// @ts-expect-error
  ...fromSeed(garlicSeed, {
    canBeFermented: true,
  }),
  name: 'Garlic',
})
