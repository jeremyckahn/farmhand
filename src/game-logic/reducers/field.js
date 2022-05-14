import { cropLifeStage, itemType, toolType } from '../../enums'
import { itemsMap } from '../../data/maps'
import {
  chooseRandom,
  doesInventorySpaceRemain,
  getCropLifeStage,
  getPlotContentType,
  getSeedItemIdFromFinalStageCropItemId,
  isRandomNumberLessThan,
} from '../../utils'
import { HOE_LEVEL_TO_SEED_RECLAIM_RATE } from '../../constants'
import { INVENTORY_FULL_NOTIFICATION } from '../../strings'
import { ResourceFactory } from '../../factories'

import { addItemToInventory } from './addItemToInventory'

import { showNotification } from './showNotification'
import { modifyFieldPlotAt } from './modifyFieldPlotAt'
import { removeFieldPlotAt } from './removeFieldPlotAt'

const { GROWN } = cropLifeStage

/**
 * @param {farmhand.state} state
 * @param {number} x
 * @param {number} y
 * @returns {farmhand.state}
 */
export const minePlot = (state, x, y) => {
  const { field } = state
  const row = field[y]

  if (row[x]) {
    // Something is already planted in field[x][y]
    return state
  }

  if (!doesInventorySpaceRemain(state)) {
    return showNotification(state, INVENTORY_FULL_NOTIFICATION)
  }

  const shovelLevel = state.toolLevels[toolType.SHOVEL]
  const spawnedResources = ResourceFactory.instance().generateResources(
    shovelLevel
  )
  let spawnedOre = null
  let daysUntilClear = chooseRandom([1, 2, 2, 3])

  if (spawnedResources.length) {
    // even when multiple resources are spawned, the first one is ok to use
    // for all subsequent logic
    spawnedOre = spawnedResources[0]

    // if ore was spawned, add up to 10 days to the time to clear
    // at random, based loosely on the spawnChance meant to make
    // rarer ores take longer to cooldown
    daysUntilClear += Math.round(
      Math.random() * (1 - spawnedOre.spawnChance) * 10
    )

    for (let resource of spawnedResources) {
      state = addItemToInventory(state, resource)
    }
  }

  state = modifyFieldPlotAt(state, x, y, () => {
    return {
      isShoveled: true,
      daysUntilClear,
      oreId: spawnedOre ? spawnedOre.id : null,
    }
  })

  return {
    ...state,
  }
}

/**
 * @param {farmhand.state} state
 * @param {number} x
 * @param {number} y
 * @returns {farmhand.state}
 */
export const clearPlot = (state, x, y) => {
  const plotContent = state.field[y][x]
  const hoeLevel = state.toolLevels[toolType.HOE]

  if (!plotContent || plotContent.isShoveled) {
    return state
  }

  if (
    getPlotContentType(plotContent) === itemType.CROP &&
    getCropLifeStage(plotContent) !== GROWN &&
    isRandomNumberLessThan(HOE_LEVEL_TO_SEED_RECLAIM_RATE[hoeLevel])
  ) {
    const seedId = getSeedItemIdFromFinalStageCropItemId(plotContent.itemId)
    state = addItemToInventory(state, itemsMap[seedId])
  }

  const item = itemsMap[plotContent.itemId]

  if (item.isReplantable && !doesInventorySpaceRemain(state)) {
    return state
  }

  state = removeFieldPlotAt(state, x, y)

  return item.isReplantable || getCropLifeStage(plotContent) === GROWN
    ? addItemToInventory(state, item)
    : state
}
