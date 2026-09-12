import { crop, fromSeed } from '../crop.js'
import { cropType, season } from '../../enums.js'

/**
 * @property farmhand.module:items.potatoSeed
 */
export const potatoSeed: farmhand.item = crop({
  cropType: cropType.POTATO,
  cropTimeline: [2, 1, 1, 1],
  growsInto: 'potato',
  highDemandSeasons: [season.FALL, season.WINTER],
  id: 'potato-seed',
  lowDemandSeasons: [season.SPRING, season.SUMMER],
  name: 'Potato Seeds',
  tier: 2,
})

/**
 * @property farmhand.module:items.potato
 */
export const potato: farmhand.item = crop({
  ...fromSeed(potatoSeed, {
    canBeFermented: true,
  }),
  name: 'Potato',
})
