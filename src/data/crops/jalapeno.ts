import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.jalapenoSeed

 */
export const jalapenoSeed: any = crop({
  cropType: cropType.JALAPENO,
  cropTimeline: [2, 1, 1, 1],
  growsInto: 'jalapeno',
  id: 'jalapeno-seed',
  name: 'Jalapeño Seed',
  tier: 4,
})

/**
 * @property farmhand.module:items.jalapeno

 */
export const jalapeno: any = crop({
  ...fromSeed(jalapenoSeed, {
    canBeFermented: true,
  }),
  name: 'Jalapeño',
})
