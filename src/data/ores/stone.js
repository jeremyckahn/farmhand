import { itemType } from '../../enums'
import { STONE_SPAWN_CHANCE } from '../../constants'

const { freeze } = Object

/**
 * @property farmhand.module:items.stone
 * @type {farmhand.item}
 */
export const stone = freeze({
  description: 'A piece of rock.',
  doesPriceFluctuate: false,
  id: 'stone',
  name: 'Stone',
  type: itemType.STONE,
  value: 10,
  spawnChance: STONE_SPAWN_CHANCE,
})
