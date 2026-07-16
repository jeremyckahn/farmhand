import { items as itemImages } from '../img/index.js'
import { treeLifeStage } from '../enums.js'

import { getTreeGrowingPhase } from './getTreeGrowingPhase.js'
import { getTreeLifeStage } from './getTreeLifeStage.js'
import { isPlantedTree } from './isPlantedTree.js'

const { SEED, GROWING, GROWN, DEAD } = treeLifeStage

export const getForestPlotImage = (
  plotContents: farmhand.plantedTree | farmhand.forestForageable | null
): string | null => {
  if (!plotContents) {
    return null
  }

  if (isPlantedTree(plotContents)) {
    let itemImageId

    switch (getTreeLifeStage(plotContents)) {
      case DEAD:
        itemImageId = `${plotContents.itemId}-tree-dead`
        break

      case GROWN:
        itemImageId = `${plotContents.itemId}-tree-grown`
        break

      case GROWING:
        itemImageId = `${
          plotContents.itemId
        }-tree-growing-${getTreeGrowingPhase(plotContents)}`
        break

      case SEED:
      default:
        // Deliberately not the sapling item's own id (e.g. 'apple-sapling')
        // — that key is shared with the generic inventory/shop icon (see
        // ItemList.tsx, which looks images up by item.id for every item
        // type), which needs a compact square image. The on-plot sapling
        // art is a tall canvas matching the rest of the tree's growth
        // frames, so it's kept under its own suffixed key. The "-tree-"
        // infix throughout this switch (also on -grown/-growing/-dead)
        // keeps these on-plot tree sprite keys visually distinct from the
        // similarly-named harvested-fruit keys (e.g. 'apple-fruit-grown',
        // or the bare 'apple' fruit item image).
        itemImageId = `${plotContents.itemId}-tree-sapling-planted`
    }

    return (itemImages as Record<string, string>)[itemImageId] ?? null
  }

  return (
    (itemImages as Record<string, string>)[
      (plotContents as farmhand.forestForageable).forageableId
    ] ?? null
  )
}
