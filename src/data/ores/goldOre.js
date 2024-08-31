/** @typedef {import("../../index").farmhand.item} farmhand.item */
import { itemType } from '../../enums.js'
import { GOLD_SPAWN_CHANCE } from '../../constants.js'

const { freeze } = Object

/**
 * @property farmhand.module:items.goldOre
 * @type {farmhand.item}
 */
export const goldOre = freeze({
  description: 'A piece of gold ore.',
  doesPriceFluctuate: true,
  id: 'gold-ore',
  name: 'Gold Ore',
  type: itemType.ORE,
  value: 500,
  spawnChance: GOLD_SPAWN_CHANCE,
})
