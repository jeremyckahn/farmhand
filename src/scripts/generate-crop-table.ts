// Must be invoked with babel: https://stackoverflow.com/a/51532127/470685
import markdownTable from 'markdown-table'

import { levels } from '../data/levels.js'
import { itemsMap } from '../data/maps.js'
import { moneyString } from '../utils/moneyString.js'

const getDaysToMature = seedItem => {
  return seedItem.cropTimeline.reduce((days, acc) => days + acc)
}


function getCropImage(seedItem: any, cropItem: (farmhand.item|farmhand.cropVariety)) {
  if (Array.isArray(seedItem.growsInto)) {
    return `![${
      cropItem.name
    }](https://raw.githubusercontent.com/jeremyckahn/farmhand/main/src/img/items/${cropItem.imageId ||
      cropItem.id}.png)`
  } else {
    return `![${cropItem.name}](https://raw.githubusercontent.com/jeremyckahn/farmhand/main/src/img/items/${cropItem.id}.png)`
  }
}


function getSeedImage(seedItem: any) {
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

const rows: (string | number)[][] = []


const getCropRow = (level: number, seedItem: any, cropItem: any) => {
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

const table = markdownTable([headers, ...rows.map(row => row.map(String))])

console.log(table)
