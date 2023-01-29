import { itemType, toolType, toolLevel } from '../enums'

import * as items from './items'
import * as recipes from './recipes'

const coalNeededForIngots = (ingotId, amount = 1) => {
  switch (ingotId) {
    case recipes.bronzeIngot.playerId:
      return amount * 2

    case recipes.ironIngot.playerId:
      return Math.round(amount * 3.5)

    case recipes.silverIngot.playerId:
      return Math.round(amount * 2.5)

    case recipes.goldIngot.playerId:
      return amount * 3

    default:
      return amount
  }
}

const { bronzeIngot, ironIngot, silverIngot, goldIngot } = recipes
const { coal } = items

/**
 * @type {farmhand.upgradesMetadata}
 */
const upgrades = {
  [toolType.HOE]: {
    [toolLevel.DEFAULT]: {
      playerId: 'hoe-default',
      name: 'Basic Hoe',
      nextLevel: toolLevel.BRONZE,
    },
    [toolLevel.BRONZE]: {
      playerId: 'hoe-bronze',
      description: 'Gives 25% chance to retrieve seeds when digging up crops',
      name: 'Bronze Hoe',
      ingredients: {
        [bronzeIngot.playerId]: 8,
        [coal.playerId]: coalNeededForIngots(bronzeIngot.playerId, 8),
      },
      nextLevel: toolLevel.IRON,
    },
    [toolLevel.IRON]: {
      playerId: 'hoe-iron',
      description: 'Gives 50% chance to retrieve seeds when digging up crops',
      name: 'Iron Hoe',
      ingredients: {
        [ironIngot.playerId]: 8,
        [coal.playerId]: coalNeededForIngots(ironIngot.playerId, 8),
      },
      nextLevel: toolLevel.SILVER,
    },
    [toolLevel.SILVER]: {
      playerId: 'hoe-silver',
      description: 'Gives 75% chance to retrieve seeds when digging up crops',
      name: 'Silver Hoe',
      ingredients: {
        [silverIngot.playerId]: 8,
        [coal.playerId]: coalNeededForIngots(silverIngot.playerId, 8),
      },
      nextLevel: toolLevel.GOLD,
    },
    [toolLevel.GOLD]: {
      playerId: 'hoe-gold',
      description: 'Gives 100% chance to retrieve seeds when digging up crops',
      name: 'Gold Hoe',
      ingredients: {
        [goldIngot.playerId]: 8,
        [coal.playerId]: coalNeededForIngots(goldIngot.playerId, 8),
      },
      isMaxLevel: true,
    },
  },
  [toolType.SCYTHE]: {
    [toolLevel.DEFAULT]: {
      playerId: 'scythe-default',
      name: 'Basic Scythe',
      nextLevel: toolLevel.BRONZE,
    },
    [toolLevel.BRONZE]: {
      playerId: 'scythe-bronze',
      description: 'Increases crop yield by 1 when harvesting',
      name: 'Bronze Scythe',
      ingredients: {
        [bronzeIngot.playerId]: 10,
        [coal.playerId]: coalNeededForIngots(bronzeIngot.playerId, 10),
      },
      nextLevel: toolLevel.IRON,
    },
    [toolLevel.IRON]: {
      playerId: 'scythe-iron',
      description: 'Increases crop yield by 2 when harvesting',
      name: 'Iron Scythe',
      ingredients: {
        [ironIngot.playerId]: 10,
        [coal.playerId]: coalNeededForIngots(ironIngot.playerId, 10),
      },
      nextLevel: toolLevel.SILVER,
    },
    [toolLevel.SILVER]: {
      playerId: 'scythe-silver',
      description: 'Increases crop yield by 3 when harvesting',
      name: 'Silver Scythe',
      ingredients: {
        [silverIngot.playerId]: 10,
        [coal.playerId]: coalNeededForIngots(silverIngot.playerId, 10),
      },
      nextLevel: toolLevel.GOLD,
    },
    [toolLevel.GOLD]: {
      playerId: 'scythe-gold',
      description: 'Increases crop yield by 4 when harvesting',
      name: 'Gold Scythe',
      ingredients: {
        [goldIngot.playerId]: 10,
        [coal.playerId]: coalNeededForIngots(goldIngot.playerId, 10),
      },
      isMaxLevel: true,
    },
  },
  [toolType.SHOVEL]: {
    [toolLevel.DEFAULT]: {
      playerId: 'shovel-default',
      name: 'Basic Shovel',
      nextLevel: toolLevel.BRONZE,
    },
    [toolLevel.BRONZE]: {
      playerId: 'shovel-bronze',
      description: 'Increases chance of finding ore',
      name: 'Bronze Shovel',
      ingredients: {
        [bronzeIngot.playerId]: 15,
        [coal.playerId]: coalNeededForIngots(bronzeIngot.playerId, 15),
      },
      nextLevel: toolLevel.IRON,
    },
    [toolLevel.IRON]: {
      playerId: 'shovel-iron',
      description: 'Increases chance of finding ore',
      name: 'Iron Shovel',
      ingredients: {
        [ironIngot.playerId]: 15,
        [coal.playerId]: coalNeededForIngots(ironIngot.playerId, 15),
      },
      nextLevel: toolLevel.SILVER,
    },
    [toolLevel.SILVER]: {
      playerId: 'shovel-silver',
      description: 'Increases chance of finding ore',
      name: 'Silver Shovel',
      ingredients: {
        [silverIngot.playerId]: 15,
        [coal.playerId]: coalNeededForIngots(silverIngot.playerId, 15),
      },
      nextLevel: toolLevel.GOLD,
    },
    [toolLevel.GOLD]: {
      playerId: 'shovel-gold',
      description: 'Increases chance of finding ore',
      name: 'Gold Shovel',
      ingredients: {
        [goldIngot.playerId]: 15,
        [coal.playerId]: coalNeededForIngots(goldIngot.playerId, 15),
      },
      isMaxLevel: true,
    },
  },
}

// add some defaults to each upgrade object
for (let toolType in upgrades) {
  for (let i in upgrades[toolType]) {
    Object.assign(upgrades[toolType][i], {
      toolType,
      value: 0,
      doesPriceFluctuate: false,
      type: itemType.TOOL_UPGRADE,
      level: i,
    })
  }
}

export default upgrades
