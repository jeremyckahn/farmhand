import { cropLifeStage, toolType } from '../../enums.js'
import { itemsMap } from '../../data/maps.js'
import { random } from '../../common/utils.js'
import { AXE_WOOD_YIELD_RANGE } from '../../constants.js'
import { doesInventorySpaceRemain } from '../../utils/doesInventorySpaceRemain.js'
import { getFruitLifeStage } from '../../utils/getFruitLifeStage.js'
import { getTreeLifeStage } from '../../utils/getTreeLifeStage.js'
import { isPlantedTree } from '../../utils/isPlantedTree.js'

import { addItemToInventory } from './addItemToInventory.js'
import { modifyForestPlotAt } from './modifyForestPlotAt.js'

const { GROWN } = cropLifeStage

const getWoodYield = (
  toolLevel: farmhand.toolLevel,
  isFullyGrown: boolean
): number => {
  const range = AXE_WOOD_YIELD_RANGE[toolLevel]

  if (!range) return 0

  let [min, max] = range

  // An immature tree yields less wood than a fully grown one, from the
  // same axe tier's range.
  if (!isFullyGrown) {
    min = Math.max(1, Math.floor(min / 2))
    max = Math.max(1, Math.floor(max / 2))
  }

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
  if (!doesInventorySpaceRemain(state)) return state

  // Chopping down a tree that still has ripe fruit on it harvests that
  // fruit as a bonus before the tree itself comes down.
  if (getFruitLifeStage(plotContent) === GROWN) {
    const fruitItem = itemsMap[plotContent.itemId]

    if (fruitItem) {
      state = addItemToInventory(state, fruitItem)
    }
  }

  const wood = itemsMap.wood

  if (wood) {
    const woodAmount = getWoodYield(
      state.toolLevels[toolType.AXE],
      getTreeLifeStage(plotContent) === GROWN
    )

    state = addItemToInventory(state, wood, woodAmount)
  }

  return modifyForestPlotAt(state, x, y, () => null)
}
