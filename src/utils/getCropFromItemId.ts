import { getPlotContentFromItemId } from './getPlotContentFromItemId.js'

export const getCropFromItemId = (itemId: string): farmhand.crop => ({
  ...getPlotContentFromItemId(itemId),
  daysOld: 0,
  daysWatered: 0,
  wasWateredToday: false,
})
