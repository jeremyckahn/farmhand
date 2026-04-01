import { itemType } from '../../enums.ts'
import { COAL_SPAWN_CHANCE } from '../../constants.ts'

const { freeze } = Object

/**
 * @property farmhand.module:items.coal
 * @type {farmhand.item}
 */
export const coal = freeze({
  description: 'A piece of coal.',
  doesPriceFluctuate: false,
  id: 'coal',
  name: 'Coal',
  type: /** @type {farmhand.itemType} */ itemType.FUEL,
  spawnChance: COAL_SPAWN_CHANCE,
  value: 2,
})
