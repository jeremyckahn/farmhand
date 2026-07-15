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

  const { treeTimeline } = item

  if (!treeTimeline) {
    throw new Error(`${itemId} has no treeTimeline`)
  }

  // treeTimeline's last entry is how many days the tree stays GROWN before
  // dying - it's not a growth-stage frame, so it's excluded when
  // classifying SEED/GROWING/GROWN via the shared, tree-and-crop-generic
  // getLifeStageForTimeline (which has no notion of a terminal segment and
  // would otherwise just keep counting it as more GROWING days).
  const growthTimeline = treeTimeline.slice(0, -1)
  const stage = getLifeStageForTimeline(growthTimeline, daysOld)

  if (stage !== GROWN) {
    return stage
  }

  const lifespan = treeTimeline.reduce((sum, days) => sum + days, 0)

  return daysOld >= lifespan ? DEAD : GROWN
}
