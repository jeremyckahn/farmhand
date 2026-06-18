import { itemsMap } from '../data/maps.js'

export const getPlotContentType = ({
  itemId,
}: farmhand.plotContent): string | null =>
  itemId ? itemsMap[itemId].type : null
