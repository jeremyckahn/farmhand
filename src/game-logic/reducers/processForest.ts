import { cropLifeStage } from '../../enums.js'
import { getTreeLifeStage } from '../../utils/getTreeLifeStage.js'
import { isPlantedTree } from '../../utils/isPlantedTree.js'

const { GROWN } = cropLifeStage

const incrementTreeAge = (
  plotContent: farmhand.plantedTree | farmhand.forestForageable | null
): farmhand.plantedTree | farmhand.forestForageable | null => {
  if (!plotContent) return null

  const daysOld = plotContent.daysOld + 1

  if (!isPlantedTree(plotContent)) {
    return { ...plotContent, daysOld }
  }

  const updated = { ...plotContent, daysOld }

  // The fruit cycle doesn't start advancing until the tree itself has
  // reached its permanent grown state.
  return {
    ...updated,
    daysSinceLastHarvest:
      getTreeLifeStage(updated) === GROWN
        ? updated.daysSinceLastHarvest + 1
        : updated.daysSinceLastHarvest,
  }
}

export const processForest = (state: farmhand.state): farmhand.state => ({
  ...state,
  forest: state.forest.map(row => row.map(incrementTreeAge)),
})
