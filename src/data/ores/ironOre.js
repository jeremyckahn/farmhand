/** @typedef {import("../../index").farmhand.item} farmhand.item */
import { itemType } from '../../enums.js'
import { IRON_SPAWN_CHANCE } from '../../constants.js'

const { freeze } = Object

/**
 * @property farmhand.module:items.ironOre
 * @type {farmhand.item}
 */
export const ironOre = freeze({
  description: 'A piece of iron ore.',
  doesPriceFluctuate: true,
  id: 'iron-ore',
  name: 'Iron Ore',
  type: itemType.ORE,
  value: 40,
  spawnChance: IRON_SPAWN_CHANCE,
})
