import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.onionSeed

 */
export const onionSeed: any = crop({
  cropType: cropType.ONION,
  cropTimeline: [3, 1, 2, 1],
  growsInto: 'onion',
  id: 'onion-seed',
  name: 'Onion Seeds',
  tier: 2,
})

/**
 * @property farmhand.module:items.onion

 */
export const onion: any = crop({
  ...fromSeed(onionSeed, {
    canBeFermented: true,
  }),
  name: 'Onion',
})
