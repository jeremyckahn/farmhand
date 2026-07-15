import { items as itemImages } from '../img/index.js'
import { cropLifeStage } from '../enums.js'

import { getFruitGrowingPhase } from './getFruitGrowingPhase.js'
import { getFruitLifeStage } from './getFruitLifeStage.js'
import { getTreeLifeStage } from './getTreeLifeStage.js'

const { SEED, GROWN } = cropLifeStage

// Fruit is a second, independent cycle layered on top of a tree that has
// already reached its own permanent GROWN state — see ForestPlot.tsx for
// how this is rendered as a second sprite over the tree's own.
export const getForestFruitImage = (
  tree: farmhand.plantedTree
): string | null => {
  const treeLifeStage = getTreeLifeStage(tree)

  if (treeLifeStage !== GROWN) {
    return null
  }

  const fruitLifeStage = getFruitLifeStage(tree, treeLifeStage)

  if (fruitLifeStage === SEED) {
    return null
  }

  const itemImageId =
    fruitLifeStage === GROWN
      ? `${tree.itemId}-fruit-grown`
      : `${tree.itemId}-fruit-growing-${getFruitGrowingPhase(tree)}`

  return (itemImages as Record<string, string>)[itemImageId] ?? null
}
