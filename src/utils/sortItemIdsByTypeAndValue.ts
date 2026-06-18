import sortBy from 'lodash.sortby'

import { itemsMap } from '../data/maps.js'
import { itemType } from '../enums.js'

import { memoize } from './memoize.js'
import { itemTypesToShowInReverse } from './itemTypesToShowInReverse.js'

export const sortItemIdsByTypeAndValue = memoize(
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
