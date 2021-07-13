import { itemType } from '../../enums'

const { freeze } = Object

/**
 * @property farmhand.module:items.bronzeOre
 * @type {farmhand.item}
 */
export const bronzeOre = freeze({
  description: 'A piece of bronze ore you dug up in the field.',
  doesPriceFluctuate: true,
  id: 'bronze-ore',
  name: 'Bronze Ore',
  type: itemType.BRONZE_ORE,
  value: 25,
})
