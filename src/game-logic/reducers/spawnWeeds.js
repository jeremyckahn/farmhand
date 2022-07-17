import { WEEDS_SPAWN_CHANCE } from '../../constants'

import { weeds } from '../../data/items'

import isRandomNumberLessThan from '../../utils/isRandomNumberLessThan'
import { getPlotContentFromItemId } from '../../utils'

export function spawnWeeds(plotContents) {
  if (plotContents) return plotContents

  let contents = null

  if (isRandomNumberLessThan(WEEDS_SPAWN_CHANCE)) {
    contents = getPlotContentFromItemId(weeds.id)
  }

  return contents
}
