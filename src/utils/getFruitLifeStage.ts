import { itemsMap } from '../data/maps.js'

import { getLifeStageForTimeline } from './getLifeStageForTimeline.js'

export const getFruitLifeStage = (
  tree: farmhand.plantedTree
): farmhand.cropLifeStage => {
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
