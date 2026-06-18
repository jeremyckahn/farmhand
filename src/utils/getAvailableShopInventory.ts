import shopInventory from '../data/shop-inventory.js'

import { unlockableItems } from '../data/levels.js'

import { memoize } from './memoize.js'

export const getAvailableShopInventory = memoize(
  (levelEntitlements: { items: Record<string, boolean> }) =>
    shopInventory.filter(
      ({ id }) =>
        !(
          unlockableItems.hasOwnProperty(id) &&
          !levelEntitlements.items.hasOwnProperty(id)
        )
    )
)
