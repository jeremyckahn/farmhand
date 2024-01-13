import { crop, fromSeed } from '../crop'
import { cropLifeStage, cropType } from '../../enums'

const { SEED, GROWING } = cropLifeStage

/**
 * @property farmhand.module:items.soybeanSeed
 * @type {farmhand.item}
 */
export const soybeanSeed = crop({
  cropType: cropType.SOYBEAN,
  cropTimetable: {
    [SEED]: 2,
    [GROWING]: [2],
  },
  growsInto: 'soybean',
  id: 'soybean-seed',
  name: 'Soybean Seeds',
  tier: 3,
})

/**
 * @property farmhand.module:items.soybean
 * @type {farmhand.item}
 */
export const soybean = crop({
  ...fromSeed(soybeanSeed, { canBeFermented: true }),
  name: 'Soybean',
})
