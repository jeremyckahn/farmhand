import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.asparagusSeed
 * @type {farmhand.item}
 */
export const asparagusSeed = crop({
  cropType: cropType.ASPARAGUS,
  cropTimeline: [4, 2, 2, 1],
  growsInto: 'asparagus',
  id: 'asparagus-seed',
  name: 'Asparagus Seed',
  tier: 4,
})

/**
 * @property farmhand.module:items.asparagus
 * @type {farmhand.item}
 */
export const asparagus = crop({
  ...fromSeed(asparagusSeed, {
    canBeFermented: true,
  }),
  name: 'Asparagus',
})
