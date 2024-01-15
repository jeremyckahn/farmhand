/** @typedef {import('../../components/Farmhand/Farmhand').farmhand.item} farmhand.item */

import { crop, fromSeed } from '../crop'
import { cropType } from '../../enums'

/**
 * @property farmhand.module:items.wheatSeed
 * @type {farmhand.item}
 */
export const wheatSeed = crop({
  cropType: cropType.WHEAT,
  cropTimeline: [1, 1],
  growsInto: 'wheat',
  id: 'wheat-seed',
  name: 'Wheat Seeds',
  tier: 3,
})

/**
 * @property farmhand.module:items.wheat
 * @type {farmhand.item}
 */
export const wheat = crop({
  ...fromSeed(wheatSeed),
  name: 'Wheat',
})
