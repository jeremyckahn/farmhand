import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.potatoSeed

 */
export const potatoSeed: any = crop({
  cropType: cropType.POTATO,
  cropTimeline: [2, 1, 1, 1],
  growsInto: 'potato',
  id: 'potato-seed',
  name: 'Potato Seeds',
  tier: 2,
})

/**
 * @property farmhand.module:items.potato

 */
export const potato: any = crop({
  ...fromSeed(potatoSeed, {
    canBeFermented: true,
  }),
  name: 'Potato',
})
