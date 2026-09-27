import { crop, fromSeed } from '../crop.js'
import { cropType, season } from '../../enums.js'

/**
 * @property farmhand.module:items.oliveSeed
 */
export const oliveSeed: farmhand.item = crop({
  cropType: cropType.OLIVE,
  cropTimeline: [3, 6],
  growsInto: 'olive',
  highDemandSeasons: [season.WINTER],
  id: 'olive-seed',
  lowDemandSeasons: [season.FALL],
  name: 'Olive Seed',
  tier: 6,
})

/**
 * @property farmhand.module:items.olive
 */
export const olive: farmhand.item = crop({
  ...fromSeed(oliveSeed, {
    canBeFermented: true,
  }),
  name: 'Olive',
})
