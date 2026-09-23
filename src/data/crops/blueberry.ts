import { crop, fromSeed } from '../crop.js'
import { cropType, season } from '../../enums.js'

/**
 * @property farmhand.module:items.blueberrySeed
 */
export const blueberrySeed: farmhand.item = crop({
  cropType: cropType.BLUEBERRY,
  cropTimeline: [2, 1],
  growsInto: 'blueberry',
  highDemandSeasons: [season.FALL],
  id: 'blueberry-seed',
  lowDemandSeasons: [season.SPRING],
  name: 'Blueberry Seed',
  tier: 1,
})

/**
 * @property farmhand.module:items.blueberry
 */
export const blueberry: farmhand.item = crop({
  ...fromSeed(blueberrySeed, {
    canBeFermented: true,
  }),
  name: 'Blueberry',
})
