import {
  cropLifeStage,
  toolLevel as toolLevelEnum,
  toolType,
  treeLifeStage as treeLifeStageEnum,
} from '../../enums.js'
import { itemsMap } from '../../data/maps.js'
import { random } from '../../common/utils.js'
import { doesInventorySpaceRemain } from '../../utils/doesInventorySpaceRemain.js'
import { getChopWoodYieldRange } from '../../utils/getChopWoodYieldRange.js'
import { getFruitLifeStage } from '../../utils/getFruitLifeStage.js'
import { getTreeLifeStage } from '../../utils/getTreeLifeStage.js'
import { isPlantedTree } from '../../utils/isPlantedTree.js'

import { addItemToInventory } from './addItemToInventory.js'
import { modifyForestPlotAt } from './modifyForestPlotAt.js'

const { GROWN } = cropLifeStage
const { DEAD } = treeLifeStageEnum
const { UNAVAILABLE } = toolLevelEnum

const getWoodYield = (
  toolLevel: farmhand.toolLevel,
  isFullyGrown: boolean
): number => {
  const range = getChopWoodYieldRange(toolLevel, isFullyGrown)

  if (!range) return 0

  const [min, max] = range

  return min + Math.floor(random() * (max - min + 1))
}

export const chopForestPlot = (
  state: farmhand.state,
  x: number,
  y: number
): farmhand.state => {
  const row = state.forest[y]
  const plotContent = row?.[x]

  if (!isPlantedTree(plotContent)) return state
  if (state.toolLevels[toolType.AXE] === UNAVAILABLE) return state
  if (!doesInventorySpaceRemain(state)) return state

  const treeStage = getTreeLifeStage(plotContent)

  // Chopping down a tree that still has ripe fruit on it harvests that
  // fruit as a bonus before the tree itself comes down.
  if (getFruitLifeStage(plotContent, treeStage) === GROWN) {
    const fruitItem = itemsMap[plotContent.itemId]

    if (fruitItem) {
      state = addItemToInventory(state, fruitItem)
      state = {
        ...state,
        treeFruitsHarvested: {
          ...state.treeFruitsHarvested,
          [fruitItem.id]: (state.treeFruitsHarvested[fruitItem.id] || 0) + 1,
        },
      }
    }
  }

  const wood = itemsMap.wood

  if (wood) {
    // A dead tree yields the same full range as a living grown one - only
    // a sapling/still-growing tree gets the halved range.
    const woodAmount = getWoodYield(
      state.toolLevels[toolType.AXE],
      treeStage === GROWN || treeStage === DEAD
    )

    if (woodAmount > 0) {
      state = addItemToInventory(state, wood, woodAmount)
    }
  }

  state = { ...state, treesChopped: state.treesChopped + 1 }

  return modifyForestPlotAt(state, x, y, () => null)
}
