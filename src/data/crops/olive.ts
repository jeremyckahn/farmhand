import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.oliveSeed

 */
export const oliveSeed: any = crop({
  cropType: cropType.OLIVE,
  cropTimeline: [3, 6],
  growsInto: 'olive',
  id: 'olive-seed',
  name: 'Olive Seed',
  tier: 6,
})

/**
 * @property farmhand.module:items.olive

 */
export const olive: any = crop({
  ...fromSeed(oliveSeed, {
    canBeFermented: true,
  }),
  name: 'Olive',
})
