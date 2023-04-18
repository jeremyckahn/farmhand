import { WEEDS_SPAWN_CHANCE } from '../../constants'

import { randomNumberService } from '../../common/services/randomNumber'
import { weed } from '../../data/items'
import { getPlotContentFromItemId } from '../../utils'

/**
 * @param {?farmhand.plotContent} plotContent
 * @returns {?farmhand.plotContent}
 */
export function spawnWeeds(plotContents) {
  if (plotContents) return plotContents

  let contents = null

  if (randomNumberService.isRandomNumberLessThan(WEEDS_SPAWN_CHANCE)) {
    contents = getPlotContentFromItemId(weed.id)
  }

  return contents
}
