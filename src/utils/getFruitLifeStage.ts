import { itemsMap } from '../data/maps.js'
import { cropLifeStage } from '../enums.js'

import { getLifeStageForTimeline } from './getLifeStageForTimeline.js'
import { getTreeLifeStage } from './getTreeLifeStage.js'

const { SEED, GROWN } = cropLifeStage

export const getFruitLifeStage = (
  tree: farmhand.plantedTree,
  // Optional: pass this in if the caller has already computed it (e.g.
  // ForestPlot.tsx, chopForestPlot.ts) to avoid redundantly recomputing it
  // here.
  treeLifeStage?: farmhand.treeLifeStage
): farmhand.cropLifeStage => {
  // Fruit is only relevant while the tree itself is GROWN: before that,
  // there's nothing to show yet (daysSinceLastHarvest is frozen at 0 - see
  // processForest.ts), and once the tree dies, daysSinceLastHarvest freezes
  // at whatever it happened to be at the moment of death, which could
  // otherwise read as permanently-ripe fruit forever.
  if ((treeLifeStage ?? getTreeLifeStage(tree)) !== GROWN) {
    return SEED
  }

  const { itemId, daysSinceLastHarvest = 0 } = tree
  const item = itemsMap[itemId]

  if (!item) {
    throw new Error(`${itemId} is not a valid item`)
  }

  const { fruitTimeline } = item

  if (!fruitTimeline) {
    throw new Error(`${itemId} has no fruitTimeline`)
  }

  return getLifeStageForTimeline(fruitTimeline, daysSinceLastHarvest)
}
