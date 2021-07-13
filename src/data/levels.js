import * as items from './items'

export const levels = []

levels[1] = {
  unlocksShopItem: items.carrotSeed.id,
}

levels[2] = {
  unlocksShopItem: items.avocadoSeed.id,
}

levels[3] = {
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

levels[14] = {
  unlocksShopItem: items.potatoSeed.id,
}

levels[16] = {
  unlocksShopItem: items.onionSeed.id,
}

levels[18] = {
  unlocksShopItem: items.soybeanSeed.id,
}

levels[20] = {
  unlocksShopItem: items.wheatSeed.id,
}

levels[22] = {
  unlocksShopItem: items.tomatoSeed.id,
}

levels[24] = {
  unlocksShopItem: items.asparagusSeed.id,
}

levels[26] = {
  unlocksShopItem: items.jalapenoSeed.id,
}

levels[28] = {
  unlocksShopItem: items.watermelonSeed.id,
}

levels[30] = {
  unlocksShopItem: items.peaSeed.id,
}

levels[32] = {
  unlocksShopItem: items.strawberrySeed.id,
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
