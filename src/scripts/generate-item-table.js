// Must be invoked with babel: https://stackoverflow.com/a/51532127/470685

import { levels } from '../data/levels.js'
import itemsMap from '../data/items-map'

for (const level of levels) {
  const { unlocksShopItem } = level

  if (unlocksShopItem) {
    console.log(itemsMap[unlocksShopItem])
  }
}
