import { itemsMap } from '../data/maps.js'
import { treeLifeStage } from '../enums.js'

import { getLifeStageForTimeline } from './getLifeStageForTimeline.js'

const { GROWN, DEAD } = treeLifeStage

export const getTreeLifeStage = (
  tree: farmhand.plantedTree
): farmhand.treeLifeStage => {
  const { itemId, daysOld = 0 } = tree
  const item = itemsMap[itemId]

  if (!item) {
    throw new Error(`${itemId} is not a valid item`)
  }

  const { treeTimeline, lifespan } = item

  if (!treeTimeline) {
    throw new Error(`${itemId} has no treeTimeline`)
  }

  const stage = getLifeStageForTimeline(treeTimeline, daysOld)

  // lifespan is a separate, optional property (see farmhand.d.ts) rather
  // than folded into treeTimeline - a tree with no lifespan set never dies.
  if (stage !== GROWN || lifespan === undefined) {
    return stage
  }

  const growthDuration = treeTimeline.reduce((sum, days) => sum + days, 0)

  return daysOld >= growthDuration + lifespan ? DEAD : GROWN
}
