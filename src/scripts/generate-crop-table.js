/** @typedef {import("../index").farmhand.item} farmhand.item */

// Must be invoked with babel: https://stackoverflow.com/a/51532127/470685
import markdownTable from 'markdown-table'

import { levels } from '../data/levels.js'
import { itemsMap } from '../data/maps'

const headers = ['Image', 'Crop', 'Seed', 'Level unlock', 'Tier', 'Base value']

const rows = []

/**
 * @param {number} level
 * @param {farmhand.item} seedItem
 * @param {farmhand.item} cropItem
 */
const getCropRow = (level, seedItem, cropItem) => {
  return [
    'Image to come',
    cropItem.name,
    seedItem.name,
    level,
    seedItem.tier,
    `$${seedItem.value}`,
  ]
}

for (const level of levels) {
  const { id, unlocksShopItem } = level

  if (unlocksShopItem) {
    const item = itemsMap[unlocksShopItem]

    const { growsInto } = item

    if (growsInto) {
      console.log(id, item)

      const seedItem = item
      if (Array.isArray(growsInto)) {
        for (const cropItemId of growsInto) {
          const cropItem = itemsMap[cropItemId]

          rows.push(getCropRow(id, seedItem, cropItem))
        }
      } else {
        const cropItem = itemsMap[growsInto]

        rows.push(getCropRow(id, seedItem, cropItem))
      }
    }
  }
}

const table = markdownTable([headers, ...rows])
console.log(table)
