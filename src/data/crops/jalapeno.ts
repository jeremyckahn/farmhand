import { crop, fromSeed } from '../crop.js'
import { cropType, season } from '../../enums.js'

/**
 * @property farmhand.module:items.jalapenoSeed
 */
export const jalapenoSeed: farmhand.item = crop({
  cropType: cropType.JALAPENO,
  cropTimeline: [2, 1, 1, 1],
  growsInto: 'jalapeno',
  highDemandSeasons: [season.SPRING, season.SUMMER],
  id: 'jalapeno-seed',
  lowDemandSeasons: [season.FALL, season.WINTER],
  name: 'Jalapeño Seed',
  tier: 4,
})

/**
 * @property farmhand.module:items.jalapeno
 */
export const jalapeno: farmhand.item = crop({
  ...fromSeed(jalapenoSeed, {
    canBeFermented: true,
  }),
  name: 'Jalapeño',
})
