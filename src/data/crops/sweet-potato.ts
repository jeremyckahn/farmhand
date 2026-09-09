import { crop, fromSeed } from '../crop.js'
import { cropType, season } from '../../enums.js'

/**
 * @property farmhand.module:items.sweetPotatoSeed
 */
export const sweetPotatoSeed: farmhand.item = crop({
  cropType: cropType.SWEET_POTATO,
  cropTimeline: [2, 1, 1, 2, 2],
  growsInto: 'sweet-potato',
  highDemandSeasons: [season.FALL, season.WINTER],
  id: 'sweet-potato-seed',
  lowDemandSeasons: [season.SPRING],
  name: 'Sweet Potato Slip',
  tier: 6,
})

/**
 * @property farmhand.module:items.sweetPotato
 */
export const sweetPotato: farmhand.item = crop({
  ...fromSeed(sweetPotatoSeed, {
    canBeFermented: true,
  }),
  name: 'Sweet Potato',
})
