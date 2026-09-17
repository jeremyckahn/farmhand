import { crop, fromSeed } from '../crop.js'
import { cropType, season } from '../../enums.js'

/**
 * @property farmhand.module:items.cornSeed
 */
export const cornSeed: farmhand.item = crop({
  cropType: cropType.CORN,
  cropTimeline: [3, 1, 1, 1, 2, 2],
  growsInto: 'corn',
  highDemandSeasons: [season.SUMMER, season.FALL],
  id: 'corn-seed',
  lowDemandSeasons: [season.SPRING, season.WINTER],
  name: 'Corn Kernels',
  tier: 2,
})

/**
 * @property farmhand.module:items.corn
 */
export const corn: farmhand.item = crop({
  ...fromSeed(cornSeed, {
    canBeFermented: true,
  }),
  name: 'Corn',
})
