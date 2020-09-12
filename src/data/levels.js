import * as items from './items'

export const levels = [
  {
    unlocksShopItem: items.spinach.id,
  },
  {
    increasesSprinklerRange: true,
  },
].map((level, i) => ({ ...level, id: i + 2 }))

export const unlockableItems = levels.reduce((acc, { id, unlocksShopItem }) => {
  if (unlocksShopItem) {
    acc[unlocksShopItem] = id
  }

  return acc
}, {})
