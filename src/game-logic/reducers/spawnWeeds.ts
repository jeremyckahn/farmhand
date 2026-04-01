import { WEEDS_SPAWN_CHANCE } from '../../constants.ts'

import { randomNumberService } from '../../common/services/randomNumber.ts'
import { weed } from '../../data/items.ts'
import { getPlotContentFromItemId } from '../../utils/index.tsx'

/**
 * @param {?farmhand.plotContent} plotContents
 * @returns {?farmhand.plotContent}
 */
export function spawnWeeds(plotContents) {
  if (plotContents) return plotContents

  let contents = null

  if (randomNumberService.isRandomNumberLessThan(WEEDS_SPAWN_CHANCE)) {
    // @ts-expect-error
    contents = getPlotContentFromItemId(weed.id)
  }

  return contents
}
