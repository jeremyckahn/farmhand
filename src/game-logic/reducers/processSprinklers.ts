import { itemType } from '../../enums.js'
import { levelAchieved } from '../../utils/levelAchieved.js'
import { getPlotContentType, getRangeCoords } from '../../utils/index.js'
import { getLevelEntitlements } from '../../utils/getLevelEntitlements.js'

import { setWasWatered } from './helpers.js'
import { modifyFieldPlotAt } from './modifyFieldPlotAt.js'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const processSprinklers = state => {
  const { field, experience } = state
  const crops = new Map()
  let modifiedField = [...field]

  const { sprinklerRange } = getLevelEntitlements(levelAchieved(experience))

  field.forEach((row, plotY) => {
    row.forEach((plot, plotX) => {
      if (!plot || getPlotContentType(plot) !== itemType.SPRINKLER) {
        return
      }

      // Flatten this 2D array for less iteration below
      getRangeCoords(sprinklerRange, plotX, plotY)
        .flat()
        .forEach(({ x, y }) => {
          const fieldRow = field[y]

          if (!fieldRow) {
            return
          }

          const plotContent = fieldRow[x]

          if (
            plotContent &&
            getPlotContentType(plotContent) === itemType.CROP
          ) {
            if (!crops.has(plotContent)) {
              modifiedField = modifyFieldPlotAt(
                { ...state, field: modifiedField },
                x,
                y,
                setWasWatered
              ).field
            }

            crops.set(plotContent, { x, y })
          }
        })
    })
  })

  return { ...state, field: modifiedField }
}
