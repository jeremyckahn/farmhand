import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.onionSeed
 * @type {farmhand.item}
 */
export const onionSeed = crop({
  cropType: cropType.ONION,
  cropTimeline: [3, 1, 2, 1],
  growsInto: 'onion',
  id: 'onion-seed',
  name: 'Onion Seeds',
  tier: 2,
})

/**
 * @property farmhand.module:items.onion
 * @type {farmhand.item}
 */
export const onion = crop({
  ...fromSeed(onionSeed, {
    canBeFermented: true,
  }),
  name: 'Onion',
})
