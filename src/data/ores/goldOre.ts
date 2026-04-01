import { itemType } from '../../enums.ts'
import { GOLD_SPAWN_CHANCE } from '../../constants.ts'

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
  type: /** @type {farmhand.itemType} */ itemType.ORE,
  value: 500,
  spawnChance: GOLD_SPAWN_CHANCE,
})
