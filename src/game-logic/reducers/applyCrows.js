import { random } from '../../common/utils'
import { doesPlotContainCrop } from '../../utils'
import { CROW_CHANCE, MAX_CROWS } from '../../constants'
import { CROWS_DESTROYED } from '../../templates'

import { randomNumberService } from '../../common/services/randomNumber'

import { modifyFieldPlotAt } from './modifyFieldPlotAt'
import { fieldHasScarecrow } from './helpers'

/**
 * @param {farmhand.state} state
 * @callback {forEachPlotCallback} callback
 */
export function forEachPlot(state, callback) {
  state.field.forEach((row, y) =>
    row.forEach((plotContents, x) => callback(plotContents, x, y))
  )
}

/**
 * @callback forEachPlotCallback
 * @param {object} plotContents - the contents of the plot
 * @param {number} x - the X coordinate for the plot
 * @param {number} y - the Y coordinate for the plot
 */

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const applyCrows = state => {
  const { field, purchasedField } = state

  if (
    fieldHasScarecrow(field) ||
    randomNumberService.isRandomNumberLessThan(1 - CROW_CHANCE)
  ) {
    return state
  }

  const newDayNotifications = [...state.newDayNotifications]

  let notificationMessages = []
  const plotsWithCrops = []

  forEachPlot(state, (_plotContents, x, y) => {
    if (doesPlotContainCrop(state.field[y][x])) {
      plotsWithCrops.push({ x, y })
    }
  })

  const numCrows = Math.min(
    plotsWithCrops.length,
    Math.floor(random() * (purchasedField + 1) * MAX_CROWS)
  )
  let numCropsDestroyed = 0

  for (let i = 0; i < numCrows; i++) {
    const attackPlotId = Math.floor(random() * plotsWithCrops.length)
    const target = plotsWithCrops.splice(attackPlotId, 1)[0]

    state = modifyFieldPlotAt(state, target.x, target.y, () => null)
    numCropsDestroyed += 1
  }

  if (numCropsDestroyed > 0) {
    notificationMessages.push(CROWS_DESTROYED`${numCropsDestroyed}`)
  }

  if (notificationMessages.length) {
    newDayNotifications.push({
      message: notificationMessages.join('\n\n'),
      severity: 'error',
    })
  }

  return {
    ...state,
    newDayNotifications,
  }
}
