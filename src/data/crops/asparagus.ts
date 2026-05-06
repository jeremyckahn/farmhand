import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.asparagusSeed

 */
export const asparagusSeed: any = crop({
  cropType: cropType.ASPARAGUS,
  cropTimeline: [4, 2, 2, 1],
  growsInto: 'asparagus',
  id: 'asparagus-seed',
  name: 'Asparagus Seed',
  tier: 4,
})

/**
 * @property farmhand.module:items.asparagus

 */
export const asparagus: any = crop({
  ...fromSeed(asparagusSeed, {
    canBeFermented: true,
  }),
  name: 'Asparagus',
})
