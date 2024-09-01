/** @typedef {import("../../index").farmhand.item} farmhand.item */
import { itemType } from '../../enums.js'
import { COAL_SPAWN_CHANCE } from '../../constants.js'

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
  type: itemType.FUEL,
  spawnChance: COAL_SPAWN_CHANCE,
  value: 2,
})
