import { itemType } from '../../enums'

const { freeze } = Object

/**
 * @property farmhand.module:items.silverOre
 * @type {farmhand.item}
 */
export const silverOre = freeze({
  description: 'A piece of silver ore.',
  doesPriceFluctuate: true,
  id: 'silver-ore',
  name: 'Silver Ore',
  type: itemType.ORE,
  value: 50,
  spawnChance: 0.02,
})
