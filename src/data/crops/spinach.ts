import { crop, fromSeed } from '../crop.js'
import { cropType, season } from '../../enums.js'

/**
 * @property farmhand.module:items.spinachSeed
 */
export const spinachSeed: farmhand.item = crop({
  cropType: cropType.SPINACH,
  cropTimeline: [2, 4],
  growsInto: 'spinach',
  highDemandSeasons: [season.SPRING, season.SUMMER],
  id: 'spinach-seed',
  lowDemandSeasons: [season.WINTER],
  name: 'Spinach Seed',
  tier: 1,
})

/**
 * @property farmhand.module:items.spinach
 */
export const spinach: farmhand.item = crop({
  ...fromSeed(spinachSeed, {
    canBeFermented: true,
  }),
  name: 'Spinach',
})
