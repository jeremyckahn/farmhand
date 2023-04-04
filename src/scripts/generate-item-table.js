// Must be invoked with babel: https://stackoverflow.com/a/51532127/470685
import markdownTable from 'markdown-table'

import { levels } from '../data/levels.js'
import { itemsMap } from '../data/maps'

const headers = ['Image', 'Crop', 'Seed', 'Level unlock', 'Tier', 'Base value']

const rows = []

for (const level of levels) {
  const { id, unlocksShopItem } = level

  if (unlocksShopItem) {
    const item = itemsMap[unlocksShopItem]

    const { growsInto } = item

    if (growsInto) {
      console.log(id, item)

      if (Array.isArray(growsInto)) {
        // FIMXE: Implement this
      } else {
        const seedItem = item
        const cropItem = itemsMap[growsInto]

        rows.push([
          'Image to come',
          cropItem.name,
          seedItem.name,
          id,
          seedItem.tier,
          seedItem.value,
        ])
      }
    }
  }
}

const table = markdownTable([headers, ...rows])
console.log(table)
