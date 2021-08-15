import { itemType } from '../../enums'

const { freeze } = Object

/**
 * @property farmhand.module:items.bronzeOre
 * @type {farmhand.item}
 */
export const bronzeOre = freeze({
  description: 'A piece of bronze ore.',
  doesPriceFluctuate: true,
  id: 'bronze-ore',
  name: 'Bronze Ore',
  type: itemType.ORE,
  value: 25,
  spawnChance: 0.065,
})
