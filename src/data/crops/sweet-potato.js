import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.sweetPotatoSeed
 * @type {farmhand.item}
 */
export const sweetPotatoSeed = crop({
  cropType: cropType.SWEET_POTATO,
  cropTimeline: [2, 1, 1, 2, 2],
  growsInto: 'sweet-potato',
  id: 'sweet-potato-seed',
  name: 'Sweet Potato Slip',
  tier: 6,
})

/**
 * @property farmhand.module:items.sweetPotato
 * @type {farmhand.item}
 */
export const sweetPotato = crop({
  ...fromSeed(sweetPotatoSeed, {
    canBeFermented: true,
  }),
  name: 'Sweet Potato',
})
