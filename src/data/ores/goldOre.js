import { itemType } from '../../enums'
import { GOLD_SPAWN_CHANCE } from '../../constants'

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
  value: 500,
  spawnChance: GOLD_SPAWN_CHANCE,
})
