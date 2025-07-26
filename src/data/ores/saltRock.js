import { itemType } from '../../enums.js'
import { SALT_ROCK_SPAWN_CHANCE } from '../../constants.js'

const { freeze } = Object

/**
 * @property farmhand.module:items.saltRock
 * @type {farmhand.item}
 */
export const saltRock = freeze({
  description: 'A large chunk of salt.',
  doesPriceFluctuate: true,
  id: 'salt-rock',
  name: 'Salt Rock',
  spawnChance: SALT_ROCK_SPAWN_CHANCE,
  type: /** @type {farmhand.itemType} */ (itemType.STONE),
  value: 10,
})
