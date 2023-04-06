/** @typedef {import("../index").farmhand.item} farmhand.item */
/** @typedef {import("../index").farmhand.cropVariety} farmhand.cropVariety */

// Must be invoked with babel: https://stackoverflow.com/a/51532127/470685
import markdownTable from 'markdown-table'

import { levels } from '../data/levels.js'
import { itemsMap } from '../data/maps'

const getDaysToMature = seedItem => {
  return Object.values(seedItem.cropTimetable).reduce(
    (days, acc) => days + acc,
    0
  )
}

/**
 * @param {farmhand.item} seedItem
 * @param {(farmhand.item|farmhand.cropVariety)} cropItem
 */
function getItemImage(seedItem, cropItem) {
  if (Array.isArray(seedItem.growsInto)) {
    return `![${cropItem.name}](https://raw.githubusercontent.com/jeremyckahn/farmhand/main/src/img/items/${cropItem.imageId}.png)`
  } else {
    return `![${cropItem.name}](https://raw.githubusercontent.com/jeremyckahn/farmhand/main/src/img/items/${cropItem.id}.png)`
  }
}

const headers = [
  'Image',
  'Crop',
  'Seed',
  'Level unlock',
  'Base value',
  'Days to mature',
  'Tier',
]

const rows = []

/**
 * @param {number} level
 * @param {farmhand.item} seedItem
 * @param {farmhand.item} cropItem
 */
const getCropRow = (level, seedItem, cropItem) => {
  return [
    getItemImage(seedItem, cropItem),
    cropItem.name,
    seedItem.name,
    level,
    `$${seedItem.value}`,
    getDaysToMature(seedItem),
    seedItem.tier,
  ]
}

for (const level of levels) {
  const { id, unlocksShopItem } = level

  if (unlocksShopItem) {
    const item = itemsMap[unlocksShopItem]

    const { growsInto } = item

    if (growsInto) {
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
