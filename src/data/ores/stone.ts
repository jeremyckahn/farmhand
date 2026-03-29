import { itemType } from '../../enums.js'
import { STONE_SPAWN_CHANCE } from '../../constants.js'

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
  spawnChance: STONE_SPAWN_CHANCE,
  type: /** @type {farmhand.itemType} */ (itemType.STONE),
  value: 10,
})
