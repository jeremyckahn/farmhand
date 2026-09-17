import { crop, fromSeed } from '../crop.js'
import { cropType, season } from '../../enums.js'

/**
 * @property farmhand.module:items.asparagusSeed
 */
export const asparagusSeed: farmhand.item = crop({
  cropType: cropType.ASPARAGUS,
  cropTimeline: [4, 2, 2, 1],
  growsInto: 'asparagus',
  highDemandSeasons: [season.SUMMER],
  id: 'asparagus-seed',
  lowDemandSeasons: [season.WINTER],
  name: 'Asparagus Seed',
  tier: 4,
})

/**
 * @property farmhand.module:items.asparagus
 */
export const asparagus: farmhand.item = crop({
  ...fromSeed(asparagusSeed, {
    canBeFermented: true,
  }),
  name: 'Asparagus',
})
