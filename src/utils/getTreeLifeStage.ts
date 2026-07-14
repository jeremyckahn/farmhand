import { itemsMap } from '../data/maps.js'

import { getLifeStageForTimeline } from './getLifeStageForTimeline.js'

export const getTreeLifeStage = (
  tree: farmhand.plantedTree
): farmhand.cropLifeStage => {
  const { itemId, daysOld = 0 } = tree
  const item = itemsMap[itemId]

  if (!item) {
    throw new Error(`${itemId} is not a valid item`)
  }

  const { treeTimeline } = item

  if (!treeTimeline) {
    throw new Error(`${itemId} has no treeTimeline`)
  }

  return getLifeStageForTimeline(treeTimeline, daysOld)
}
