import { itemType } from '../../enums'

const { freeze } = Object

/**
 * @property farmhand.module:items.goldOre
 * @type {farmhand.item}
 */
export const goldOre = freeze({
  description: 'A piece of gold ore.',
  doesPriceFluctuate: true,
  id: 'gold-ore',
  name: 'Gold Ore',
  type: itemType.ORE,
  value: 100,
})
