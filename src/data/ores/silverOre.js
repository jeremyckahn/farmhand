/** @typedef {import("../../index").farmhand.item} farmhand.item */
import { itemType } from '../../enums.js'
import { SILVER_SPAWN_CHANCE } from '../../constants.js'

const { freeze } = Object

/**
 * @property farmhand.module:items.silverOre
 * @type {farmhand.item}
 */
export const silverOre = freeze({
  description: 'A piece of silver ore.',
  doesPriceFluctuate: true,
  id: 'silver-ore',
  name: 'Silver Ore',
  type: itemType.ORE,
  value: 100,
  spawnChance: SILVER_SPAWN_CHANCE,
})
