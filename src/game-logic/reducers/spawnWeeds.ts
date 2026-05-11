import { WEEDS_SPAWN_CHANCE } from '../../constants.js'

import { randomNumberService } from '../../common/services/randomNumber.js'
import { weed } from '../../data/items.js'
import { getPlotContentFromItemId } from '../../utils/index.js'

export function spawnWeeds(
  plotContents: farmhand.plotContent | null
): farmhand.plotContent | null {
  if (plotContents) return plotContents

  let contents: farmhand.plotContent | null = null

  if (randomNumberService.isRandomNumberLessThan(WEEDS_SPAWN_CHANCE)) {
    contents = getPlotContentFromItemId(
      (weed as farmhand.item).id
    ) as farmhand.plotContent
  }

  return contents
}
