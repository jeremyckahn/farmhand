import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.garlicSeed

 */
export const garlicSeed: any = crop({
  cropType: cropType.GARLIC,
  cropTimeline: [2, 1, 1, 1],
  growsInto: 'garlic',
  id: 'garlic-seed',
  name: 'Garlic Bulb',
  tier: 5,
})

/**
 * @property farmhand.module:items.garlic

 */
export const garlic: any = crop({
  ...fromSeed(garlicSeed, {
    canBeFermented: true,
  }),
  name: 'Garlic',
})
