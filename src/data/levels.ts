import { stageFocusType, toolType } from '../enums.js'
import { features } from '../config.js'

import * as items from './items.js'
import * as recipes from './recipes.js'

export const levels = []

// @ts-expect-error
levels[1] = {
  unlocksShopItem: items.carrotSeed.id,
}

// @ts-expect-error
levels[2] = {
  unlocksShopItem: items.spinachSeed.id,
}

// @ts-expect-error
levels[3] = {
  unlocksShopItem: recipes.fertilizer.id,
}

// @ts-expect-error
levels[4] = {
  unlocksShopItem: items.pumpkinSeed.id,
}

// @ts-expect-error
levels[5] = {
  unlocksShopItem: items.sprinkler.id,
}

// @ts-expect-error
levels[6] = {
  unlocksTool: toolType.SHOVEL,
}

// @ts-expect-error
levels[8] = {
  increasesSprinklerRange: true,
}

// @ts-expect-error
levels[10] = {
  unlocksShopItem: items.cornSeed.id,
}

// @ts-expect-error
levels[12] = {
  increasesSprinklerRange: true,
}

// @ts-expect-error
levels[14] = {
  unlocksShopItem: items.potatoSeed.id,
}

// @ts-expect-error
if (features.FOREST) {
  // @ts-expect-error
  levels[15] = {
    unlocksStageFocusType: stageFocusType.FOREST,
  }
}

// @ts-expect-error
levels[16] = {
  unlocksShopItem: items.onionSeed.id,
}

// @ts-expect-error
levels[18] = {
  unlocksShopItem: items.soybeanSeed.id,
}

// @ts-expect-error
levels[20] = {
  unlocksShopItem: items.wheatSeed.id,
}

// @ts-expect-error
levels[22] = {
  unlocksShopItem: items.tomatoSeed.id,
}

// @ts-expect-error
levels[24] = {
  unlocksShopItem: items.asparagusSeed.id,
}

// @ts-expect-error
levels[26] = {
  unlocksShopItem: items.jalapenoSeed.id,
}

// @ts-expect-error
levels[28] = {
  unlocksShopItem: items.watermelonSeed.id,
}

// @ts-expect-error
levels[30] = {
  unlocksShopItem: items.peaSeed.id,
}

// @ts-expect-error
levels[32] = {
  unlocksShopItem: items.strawberrySeed.id,
}

// @ts-expect-error
levels[34] = {
  unlocksShopItem: items.garlicSeed.id,
}

// @ts-expect-error
levels[36] = {
  unlocksShopItem: items.sweetPotatoSeed.id,
}

// @ts-expect-error
levels[38] = {
  unlocksShopItem: items.oliveSeed.id,
}

// @ts-expect-error
levels[40] = {
  unlocksShopItem: items.sunflowerSeed.id,
}

// @ts-expect-error
levels[42] = {
  unlocksShopItem: items.grapeSeed.id,
}

for (let i = 0; i < levels.length; i++) {
  // @ts-expect-error
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
    // @ts-expect-error
    acc[level] = itemId
    return acc
  },
  {}
)
