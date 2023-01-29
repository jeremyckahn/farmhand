import { itemType } from '../../enums'
import { SILVER_SPAWN_CHANCE } from '../../constants'

const { freeze } = Object

/**
 * @property farmhand.module:items.silverOre
 * @type {farmhand.item}
 */
export const silverOre = freeze({
  description: 'A piece of silver ore.',
  doesPriceFluctuate: true,
  playerId: 'silver-ore',
  name: 'Silver Ore',
  type: itemType.ORE,
  value: 100,
  spawnChance: SILVER_SPAWN_CHANCE,
})
