import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.jalapenoSeed
 * @type {farmhand.item}
 */
export const jalapenoSeed = crop({
  cropType: cropType.JALAPENO,
  cropTimeline: [2, 1, 1, 1],
  growsInto: 'jalapeno',
  id: 'jalapeno-seed',
  name: 'Jalapeño Seed',
  tier: 4,
})

/**
 * @property farmhand.module:items.jalapeno
 * @type {farmhand.item}
 */
export const jalapeno = crop({
  ...fromSeed(jalapenoSeed, {
    canBeFermented: true,
  }),
  name: 'Jalapeño',
})
