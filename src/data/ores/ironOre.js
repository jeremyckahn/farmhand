import { itemType } from '../../enums'

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
})
