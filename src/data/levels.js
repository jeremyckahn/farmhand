import * as items from './items'

export const levels = [
  {},
  {
    unlocksShopItem: items.spinachSeed.id,
  },
  {
    increasesSprinklerRange: true,
  },
  {
    unlocksShopItem: items.cornSeed.id,
  },
].map((level, i) => ({ ...level, id: i + 1 }))

export const unlockableItems = levels.reduce((acc, { id, unlocksShopItem }) => {
  if (unlocksShopItem) {
    acc[unlocksShopItem] = id
  }

  return acc
}, {})
