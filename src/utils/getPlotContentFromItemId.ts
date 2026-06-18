import { fertilizerType } from '../enums.js'

export const getPlotContentFromItemId = (
  itemId: string
): farmhand.plotContent => ({
  itemId,
  fertilizerType: fertilizerType.NONE,
})
