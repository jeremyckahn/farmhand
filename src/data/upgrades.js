import { toolType, toolLevel } from '../enums'

import * as items from './items'

const upgrades = {
  [toolType.SCYTHE]: {
    [toolLevel.DEFAULT]: {
      id: 'scythe-default',
      name: 'Basic Scythe',
      nextLevel: toolLevel.BRONZE,
    },
    [toolLevel.BRONZE]: {
      id: 'scythe-bronze',
      name: 'Bronze Scythe',
      ingredients: {
        [items.bronzeOre.id]: 5,
      },
      isMaxLevel: true,
    },
  },
}

// add the tool type to each upgrade recipe
for (let type in upgrades) {
  for (let i in upgrades[type]) {
    upgrades[type][i].toolType = type
  }
}

export default upgrades
