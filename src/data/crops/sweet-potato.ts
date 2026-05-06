import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.sweetPotatoSeed

 */
export const sweetPotatoSeed: any = crop({
  cropType: cropType.SWEET_POTATO,
  cropTimeline: [2, 1, 1, 2, 2],
  growsInto: 'sweet-potato',
  id: 'sweet-potato-seed',
  name: 'Sweet Potato Slip',
  tier: 6,
})

/**
 * @property farmhand.module:items.sweetPotato

 */
export const sweetPotato: any = crop({
  ...fromSeed(sweetPotatoSeed, {
    canBeFermented: true,
  }),
  name: 'Sweet Potato',
})
