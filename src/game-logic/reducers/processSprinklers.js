import { itemType } from '../../enums'
import { levelAchieved } from '../../utils/levelAchieved'
import { getPlotContentType, getRangeCoords } from '../../utils'
import { getLevelEntitlements } from '../../utils/getLevelEntitlements'

import { setWasWatered } from './helpers'
import { modifyFieldPlotAt } from './modifyFieldPlotAt'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const processSprinklers = state => {
  const { field, itemsSold } = state
  const crops = new Map()
  let modifiedField = [...field]

  const { sprinklerRange } = getLevelEntitlements(levelAchieved({ itemsSold }))

  field.forEach((row, plotY) => {
    row.forEach((plot, plotX) => {
      if (!plot || getPlotContentType(plot) !== itemType.SPRINKLER) {
        return
      }

      ;[]
        .concat(
          // Flatten this 2D array for less iteration below
          ...getRangeCoords(sprinklerRange, plotX, plotY)
        )
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
