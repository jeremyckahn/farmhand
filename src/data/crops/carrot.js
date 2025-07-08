import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @type {farmhand.item}
 */
export const carrotSeed = crop({
  cropType: cropType.CARROT,
  cropTimeline: [2, 1, 1, 1],
  growsInto: 'carrot',
  id: 'carrot-seed',
  name: 'Carrot Seed',
  tier: 1,
})

/**
 * @type {farmhand.item}
 */
export const carrot = crop({
  ...fromSeed(carrotSeed, {
    canBeFermented: true,
  }),
  name: 'Carrot',
})
