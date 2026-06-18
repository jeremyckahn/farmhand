import sortBy from 'lodash.sortby'

import { itemType } from '../enums.js'

import { itemsMap } from '../data/maps.js'

import { memoize } from './memoize.js'

const itemTypesToShowInReverse: Set<farmhand.itemType> = new Set([
  itemType.MILK,
])

const sortItemIdsByTypeAndValue = memoize(
  (itemIds: string[]) =>
    sortBy(itemIds, [
      id => Number(itemsMap[id].type !== itemType.CROP),
      id => {
        const { type, value } = itemsMap[id]
        return itemTypesToShowInReverse.has(type) ? -value : value
      },
    ]),
  {}
)

export const sortItems = (
  items: Array<farmhand.item>
): Array<farmhand.item> => {
  const map: Record<string, farmhand.item> = {}
  items.forEach(item => (map[item.id] = item))

  return sortItemIdsByTypeAndValue(items.map(({ id }) => id)).map(id => map[id])
}
