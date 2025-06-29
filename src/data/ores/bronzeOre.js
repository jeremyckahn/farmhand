import { itemType } from '../../enums.js'
import { BRONZE_SPAWN_CHANCE } from '../../constants.js'

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
  type: /** @type {farmhand.itemType} */ (itemType.ORE),
  value: 25,
  spawnChance: BRONZE_SPAWN_CHANCE,
})
