import { itemType } from '../../enums.js'
import { STONE_SPAWN_CHANCE } from '../../constants.js'

const { freeze } = Object

/**
 * @property farmhand.module:items.stone
 */
export const stone: farmhand.item = freeze({
  description: 'A piece of rock.',
  doesPriceFluctuate: false,
  id: 'stone',
  name: 'Stone',
  spawnChance: STONE_SPAWN_CHANCE,
  type: itemType.STONE,
  value: 10,
})
