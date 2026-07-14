import { itemsMap } from '../data/maps.js'

import { getGrowingPhaseForTimeline } from './getGrowingPhaseForTimeline.js'

export const getFruitGrowingPhase = (tree: farmhand.plantedTree): number => {
  const { itemId, daysSinceLastHarvest = 0 } = tree
  const { fruitTimeline = [] } = itemsMap[itemId] ?? {}

  return getGrowingPhaseForTimeline(fruitTimeline, daysSinceLastHarvest)
}
