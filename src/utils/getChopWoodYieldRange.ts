import { AXE_WOOD_YIELD_RANGE } from '../constants.js'

// The [min, max] (inclusive) wood range a chop would yield, without rolling
// an actual amount - shared by the chopForestPlot reducer (which rolls a
// number in this range) and the forest plot tooltip (which just displays
// the range, so it doesn't need to be recomputed on every hover).
export const getChopWoodYieldRange = (
  toolLevel: farmhand.toolLevel,
  isFullyGrown: boolean
): [number, number] | null => {
  const range = AXE_WOOD_YIELD_RANGE[toolLevel]

  if (!range) return null

  const [min, max] = range

  // An immature tree yields less wood than a fully grown one, from the
  // same axe tier's range.
  if (isFullyGrown) return [min, max]

  return [Math.max(1, Math.floor(min / 2)), Math.max(1, Math.floor(max / 2))]
}
