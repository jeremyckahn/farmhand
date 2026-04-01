// Must be invoked with babel: https://stackoverflow.com/a/51532127/470685
import markdownTable from 'markdown-table'

import { levels } from '../data/levels.ts'
import { itemsMap } from '../data/maps.ts'
import { moneyString } from '../utils/moneyString.ts'

const getDaysToMature = seedItem => {
  return seedItem.cropTimeline.reduce((days, acc) => days + acc)
}

/**
 * @param {farmhand.item} seedItem
 * @param {(farmhand.item|farmhand.cropVariety)} cropItem
 */
function getCropImage(seedItem, cropItem) {
  if (Array.isArray(seedItem.growsInto)) {
    return `![${
      cropItem.name
    }](https://raw.githubusercontent.com/jeremyckahn/farmhand/main/src/img/items/${cropItem.imageId ||
      cropItem.id}.png)`
  } else {
    return `![${cropItem.name}](https://raw.githubusercontent.com/jeremyckahn/farmhand/main/src/img/items/${cropItem.id}.png)`
  }
}

/**
 * @param {farmhand.item} seedItem
 */
function getSeedImage(seedItem) {
  return `![${seedItem.name}](https://raw.githubusercontent.com/jeremyckahn/farmhand/main/src/img/items/${seedItem.id}.png)`
}

const headers = [
  'Crop',
  'Seed',
  'Unlocked at level',
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
    `${getCropImage(seedItem, cropItem)} ${cropItem.name}`,
    `${getSeedImage(seedItem)} ${seedItem.name}`,
    level,
    moneyString(seedItem.value),
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
        // @ts-expect-error
        for (const cropItemId of growsInto) {
          const cropItem = itemsMap[cropItemId]

          // @ts-expect-error
          rows.push(getCropRow(id, seedItem, cropItem))
        }
      } else {
        const cropItem = itemsMap[growsInto]

        // @ts-expect-error
        rows.push(getCropRow(id, seedItem, cropItem))
      }
    }
  }
}

const table = markdownTable([headers, ...rows])

console.log(table)
