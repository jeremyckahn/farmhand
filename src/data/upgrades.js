import { itemType, toolType, toolLevel } from '../enums'

import * as items from './items'
import * as recipes from './recipes'

const coalNeededForIngots = (ingotId, amount = 1) => {
  switch (ingotId) {
    case recipes.bronzeIngot.id:
      return amount * 2

    case recipes.ironIngot.id:
      return Math.round(amount * 3.5)

    case recipes.silverIngot.id:
      return Math.round(amount * 2.5)

    case recipes.goldIngot.id:
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
      id: 'hoe-default',
      name: 'Basic Hoe',
      nextLevel: toolLevel.BRONZE,
    },
    [toolLevel.BRONZE]: {
      id: 'hoe-bronze',
      description: 'Gives 25% chance to retrieve seeds when digging up crops',
      name: 'Bronze Hoe',
      ingredients: {
        [bronzeIngot.id]: 8,
        [coal.id]: coalNeededForIngots(bronzeIngot.id, 8),
      },
      nextLevel: toolLevel.IRON,
    },
    [toolLevel.IRON]: {
      id: 'hoe-iron',
      description: 'Gives 50% chance to retrieve seeds when digging up crops',
      name: 'Iron Hoe',
      ingredients: {
        [ironIngot.id]: 8,
        [coal.id]: coalNeededForIngots(ironIngot.id, 8),
      },
      nextLevel: toolLevel.SILVER,
    },
    [toolLevel.SILVER]: {
      id: 'hoe-silver',
      description: 'Gives 75% chance to retrieve seeds when digging up crops',
      name: 'Silver Hoe',
      ingredients: {
        [silverIngot.id]: 8,
        [coal.id]: coalNeededForIngots(silverIngot.id, 8),
      },
      nextLevel: toolLevel.GOLD,
    },
    [toolLevel.GOLD]: {
      id: 'hoe-gold',
      description: 'Gives 100% chance to retrieve seeds when digging up crops',
      name: 'Gold Hoe',
      ingredients: {
        [goldIngot.id]: 8,
        [coal.id]: coalNeededForIngots(goldIngot.id, 8),
      },
      isMaxLevel: true,
    },
  },
  [toolType.SCYTHE]: {
    [toolLevel.DEFAULT]: {
      id: 'scythe-default',
      name: 'Basic Scythe',
      nextLevel: toolLevel.BRONZE,
    },
    [toolLevel.BRONZE]: {
      id: 'scythe-bronze',
      description: 'Increases crop yield by 1 when harvesting',
      name: 'Bronze Scythe',
      ingredients: {
        [bronzeIngot.id]: 10,
        [coal.id]: coalNeededForIngots(bronzeIngot.id, 10),
      },
      nextLevel: toolLevel.IRON,
    },
    [toolLevel.IRON]: {
      id: 'scythe-iron',
      description: 'Increases crop yield by 2 when harvesting',
      name: 'Iron Scythe',
      ingredients: {
        [ironIngot.id]: 10,
        [coal.id]: coalNeededForIngots(ironIngot.id, 10),
      },
      nextLevel: toolLevel.SILVER,
    },
    [toolLevel.SILVER]: {
      id: 'scythe-silver',
      description: 'Increases crop yield by 3 when harvesting',
      name: 'Silver Scythe',
      ingredients: {
        [silverIngot.id]: 10,
        [coal.id]: coalNeededForIngots(silverIngot.id, 10),
      },
      nextLevel: toolLevel.GOLD,
    },
    [toolLevel.GOLD]: {
      id: 'scythe-gold',
      description: 'Increases crop yield by 4 when harvesting',
      name: 'Gold Scythe',
      ingredients: {
        [goldIngot.id]: 10,
        [coal.id]: coalNeededForIngots(goldIngot.id, 10),
      },
      isMaxLevel: true,
    },
  },
  [toolType.SHOVEL]: {
    [toolLevel.DEFAULT]: {
      id: 'shovel-default',
      name: 'Basic Shovel',
      nextLevel: toolLevel.BRONZE,
    },
    [toolLevel.BRONZE]: {
      id: 'shovel-bronze',
      description: 'Increases chance of finding ore',
      name: 'Bronze Shovel',
      ingredients: {
        [bronzeIngot.id]: 15,
        [coal.id]: coalNeededForIngots(bronzeIngot.id, 15),
      },
      nextLevel: toolLevel.IRON,
    },
    [toolLevel.IRON]: {
      id: 'shovel-iron',
      description: 'Increases chance of finding ore',
      name: 'Iron Shovel',
      ingredients: {
        [ironIngot.id]: 15,
        [coal.id]: coalNeededForIngots(ironIngot.id, 15),
      },
      nextLevel: toolLevel.SILVER,
    },
    [toolLevel.SILVER]: {
      id: 'shovel-silver',
      description: 'Increases chance of finding ore',
      name: 'Silver Shovel',
      ingredients: {
        [silverIngot.id]: 15,
        [coal.id]: coalNeededForIngots(silverIngot.id, 15),
      },
      nextLevel: toolLevel.GOLD,
    },
    [toolLevel.GOLD]: {
      id: 'shovel-gold',
      description: 'Increases chance of finding ore',
      name: 'Gold Shovel',
      ingredients: {
        [goldIngot.id]: 15,
        [coal.id]: coalNeededForIngots(goldIngot.id, 15),
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
