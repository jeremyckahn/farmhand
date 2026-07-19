import { cropLifeStage, fertilizerType } from '../../enums.js'
import { FERTILIZER_BONUS } from '../../constants.js'
import { getTreeLifeStage } from '../../utils/getTreeLifeStage.js'
import { isPlantedTree } from '../../utils/isPlantedTree.js'

const { GROWN } = cropLifeStage
const { NONE, RAINBOW } = fertilizerType

const incrementTreeAge = (
  plotContent: farmhand.plantedTree | farmhand.forestForageable | null
): farmhand.plantedTree | farmhand.forestForageable | null => {
  if (!plotContent) return null

  const daysOld = plotContent.daysOld + 1

  if (!isPlantedTree(plotContent)) {
    return { ...plotContent, daysOld }
  }

  const isFertilized =
    plotContent.fertilizerType != null && plotContent.fertilizerType !== NONE
  const isRainbowFertilized = plotContent.fertilizerType === RAINBOW

  // daysGrown tracks growth progress separately from daysOld - fertilizer
  // accelerates it, but daysOld (used for lifespan/death elsewhere) always
  // advances at the normal rate regardless of fertilizer.
  const daysGrown =
    (plotContent.daysGrown ?? plotContent.daysOld) +
    (isFertilized ? 1 + FERTILIZER_BONUS : 1)

  const updated = { ...plotContent, daysOld, daysGrown }

  // The fruit cycle doesn't start advancing until the tree itself has
  // reached its permanent grown state. Rainbow fertilizer also speeds up
  // fruit regrowth; standard fertilizer only speeds up the initial growth
  // phase above.
  return {
    ...updated,
    daysSinceLastHarvest:
      getTreeLifeStage(updated) === GROWN
        ? updated.daysSinceLastHarvest +
          (isRainbowFertilized ? 1 + FERTILIZER_BONUS : 1)
        : updated.daysSinceLastHarvest,
  }
}

export const processForest = (state: farmhand.state): farmhand.state => ({
  ...state,
  forest: state.forest.map(row => row.map(incrementTreeAge)),
})
