import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.potatoSeed
 * @type {farmhand.item}
 */
export const potatoSeed = crop({
  cropType: cropType.POTATO,
  cropTimeline: [2, 1, 1, 1],
  growsInto: 'potato',
  id: 'potato-seed',
  name: 'Potato Seeds',
  tier: 2,
})

/**
 * @property farmhand.module:items.potato
 * @type {farmhand.item}
 */
export const potato = crop({
  ...fromSeed(potatoSeed, {
    canBeFermented: true,
  }),
  name: 'Potato',
})
