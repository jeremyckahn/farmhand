import { itemsMap } from '../data/maps.js'
import { treeLifeStage } from '../enums.js'

import { getLifeStageForTimeline } from './getLifeStageForTimeline.js'

const { GROWN, DEAD } = treeLifeStage

export const getTreeLifeStage = (tree: farmhand.plantedTree): treeLifeStage => {
  const { itemId, daysOld = 0, daysGrown = daysOld } = tree
  const item = itemsMap[itemId]

  if (!item) {
    throw new Error(`${itemId} is not a valid item`)
  }

  const { treeTimeline } = item

  if (!treeTimeline) {
    throw new Error(`${itemId} has no treeTimeline`)
  }

  // Growth staging (SEED/GROWING/GROWN) is keyed on daysGrown, which
  // fertilizer can accelerate ahead of daysOld (see processForest.ts).
  const stage = getLifeStageForTimeline(treeTimeline, daysGrown)

  // A tree instance's own randomized lifespan (rolled once at plant time -
  // see getRandomizedLifespan.ts) takes priority over the species' flat
  // default; a tree with neither set never dies. Death timing is always
  // keyed on raw daysOld, independent of daysGrown/fertilizer - fertilizer
  // speeds up how fast a tree matures, never how soon it dies.
  const lifespan = tree.lifespan ?? item.lifespan

  if (stage !== GROWN || lifespan === undefined) {
    return stage
  }

  const growthDuration = treeTimeline.reduce((sum, days) => sum + days, 0)

  return daysOld >= growthDuration + lifespan ? DEAD : GROWN
}
