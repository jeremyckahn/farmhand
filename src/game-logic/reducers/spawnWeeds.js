import { WEEDS_SPAWN_CHANCE } from '../../constants.js'

import { randomNumberService } from '../../common/services/randomNumber.js'
import { weed } from '../../data/items.js'
import { getPlotContentFromItemId } from '../../utils/index.js'

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
