import { toolType } from '../enums'

import * as items from './items'
import * as recipes from './recipes'

export const levels = []

levels[1] = {
  unlocksShopItem: items.carrotSeed.playerId,
}

levels[2] = {
  unlocksShopItem: items.spinachSeed.playerId,
}

levels[3] = {
  unlocksShopItem: recipes.fertilizer.playerId,
}

levels[4] = {
  unlocksShopItem: items.pumpkinSeed.playerId,
}

levels[5] = {
  unlocksShopItem: items.sprinkler.playerId,
}

levels[6] = {
  unlocksTool: toolType.SHOVEL,
}

levels[8] = {
  increasesSprinklerRange: true,
}

levels[10] = {
  unlocksShopItem: items.cornSeed.playerId,
}

levels[12] = {
  increasesSprinklerRange: true,
}

levels[14] = {
  unlocksShopItem: items.potatoSeed.playerId,
}

levels[16] = {
  unlocksShopItem: items.onionSeed.playerId,
}

levels[18] = {
  unlocksShopItem: items.soybeanSeed.playerId,
}

levels[20] = {
  unlocksShopItem: items.wheatSeed.playerId,
}

levels[22] = {
  unlocksShopItem: items.tomatoSeed.playerId,
}

levels[24] = {
  unlocksShopItem: items.asparagusSeed.playerId,
}

levels[26] = {
  unlocksShopItem: items.jalapenoSeed.playerId,
}

levels[28] = {
  unlocksShopItem: items.watermelonSeed.playerId,
}

levels[30] = {
  unlocksShopItem: items.peaSeed.playerId,
}

levels[32] = {
  unlocksShopItem: items.strawberrySeed.playerId,
}

levels[34] = {
  unlocksShopItem: items.garlicSeed.playerId,
}

levels[36] = {
  unlocksShopItem: items.sweetPotatoSeed.playerId,
}

levels[38] = {
  unlocksShopItem: items.oliveSeed.playerId,
}

levels[40] = {
  unlocksShopItem: items.sunflowerSeed.playerId,
}

for (let i = 0; i < levels.length; i++) {
  levels[i] = { playerId: i, ...levels[i] }
}

Object.freeze(levels)

export const unlockableItems = levels.reduce((acc, { playerId, unlocksShopItem }) => {
  if (unlocksShopItem) {
    acc[unlocksShopItem] = playerId
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
