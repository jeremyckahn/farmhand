import { itemType } from '../../enums'
import { SALT_ROCK_SPAWN_CHANCE } from '../../constants'

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
  type: itemType.STONE,
  value: 10,
})
