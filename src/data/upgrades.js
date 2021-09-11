import { itemType, toolType, toolLevel } from '../enums'

import * as items from './items'
import * as recipes from './recipes'

const upgrades = {
  [toolType.SCYTHE]: {
    [toolLevel.DEFAULT]: {
      id: 'scythe-default',
      name: 'Basic Scythe',
      nextLevel: toolLevel.BRONZE,
    },
    [toolLevel.BRONZE]: {
      id: 'scythe-bronze',
      description: 'Increases crop yield when harvesting',
      name: 'Bronze Scythe',
      ingredients: {
        [recipes.bronzeIngot.id]: 25,
        [items.coal.id]: 100,
      },
      isMaxLevel: true,
    },
  },
}

// add some defaults to each upgrade object
for (let type in upgrades) {
  for (let i in upgrades[type]) {
    upgrades[type][i].toolType = type
    upgrades[type][i].value = 0
    upgrades[type][i].doesPriceFluctuate = false
    upgrades[type][i].type = itemType.TOOL_UPGRADE
    upgrades[type][i].level = i
  }
}

export default upgrades
