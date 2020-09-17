import * as items from './items'

export const levels = []

levels[2] = {
  unlocksShopItem: items.spinachSeed.id,
}

levels[3] = {
  unlocksShopItem: items.fertilizer.id,
}

levels[4] = {
  unlocksShopItem: items.pumpkinSeed.id,
}

levels[5] = {
  unlocksShopItem: items.sprinkler.id,
}

levels[8] = {
  increasesSprinklerRange: true,
}

levels[10] = {
  unlocksShopItem: items.cornSeed.id,
}

levels[12] = {
  increasesSprinklerRange: true,
}

for (let i = 0; i < levels.length; i++) {
  levels[i] = { id: i, ...levels[i] }
}

Object.freeze(levels)

export const unlockableItems = levels.reduce((acc, { id, unlocksShopItem }) => {
  if (unlocksShopItem) {
    acc[unlocksShopItem] = id
  }

  return acc
}, {})

export const itemUnlockLevels = Object.entries(unlockableItems).reduce(
  (acc, [itemId, level]) => {
    acc[level] = itemId
    return acc
  },
  {}
)
