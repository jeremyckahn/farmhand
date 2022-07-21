import { WEEDS_SPAWN_CHANCE } from '../../constants'

import { weed } from '../../data/items'

import isRandomNumberLessThan from '../../utils/isRandomNumberLessThan'
import { getPlotContentFromItemId } from '../../utils'

/**
 * @param {?farmhand.plotContent} plotContent
 * @returns {?farmhand.plotContent}
 */
export function spawnWeeds(plotContents) {
  if (plotContents) return plotContents

  let contents = null

  if (isRandomNumberLessThan(WEEDS_SPAWN_CHANCE)) {
    contents = getPlotContentFromItemId(weed.id)
  }

  return contents
}
