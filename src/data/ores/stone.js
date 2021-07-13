import { itemType } from '../../enums'

const { freeze } = Object

/**
 * @property farmhand.module:items.stone
 * @type {farmhand.item}
 */
export const stone = freeze({
  description: 'A piece of rock you dug up in the field.',
  doesPriceFluctuate: true,
  id: 'stone',
  name: 'Stone',
  type: itemType.STONE,
  value: 10,
})
