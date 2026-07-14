import { itemsMap } from '../data/maps.js'

import { getGrowingPhaseForTimeline } from './getGrowingPhaseForTimeline.js'

export const getTreeGrowingPhase = (tree: farmhand.plantedTree): number => {
  const { itemId, daysOld = 0 } = tree
  const { treeTimeline = [] } = itemsMap[itemId] ?? {}

  return getGrowingPhaseForTimeline(treeTimeline, daysOld)
}
