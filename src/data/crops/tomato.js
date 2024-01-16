/** @typedef {import('../../components/Farmhand/Farmhand').farmhand.item} farmhand.item */

import { crop, fromSeed } from '../crop'
import { cropType } from '../../enums'

/**
 * @property farmhand.module:items.tomatoSeed
 * @type {farmhand.item}
 */
export const tomatoSeed = crop({
  cropType: cropType.TOMATO,
  cropTimeline: [2, 1, 1, 1, 2, 2, 2],
  growsInto: 'tomato',
  id: 'tomato-seed',
  name: 'Tomato Seeds',
  tier: 3,
})

/**
 * @property farmhand.module:items.tomato
 * @type {farmhand.item}
 */
export const tomato = crop({
  ...fromSeed(tomatoSeed, { canBeFermented: true }),
  name: 'Tomato',
})
