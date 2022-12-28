import { doesPlotContainCrop } from '../../utils'
import { CROW_CHANCE, MAX_CROWS } from '../../constants'
import { CROWS_DESTROYED } from '../../templates'

import { modifyFieldPlotAt } from './modifyFieldPlotAt'

import { fieldHasScarecrow } from './helpers'

// TODO: Add tests for this reducer.
/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const applyCrows = state => {
  const { field, purchasedField } = state

  if (fieldHasScarecrow(field) || Math.random() > CROW_CHANCE) {
    return state
  }

  const newDayNotifications = [...state.newDayNotifications]

  let notificationMessages = []
  const plotsWithCrops = []

  field.forEach((row, y) =>
    row.forEach((plotContents, x) => {
      if (doesPlotContainCrop(plotContents)) {
        plotsWithCrops.push({ x, y })
      }
    })
  )

  const numCrows = Math.min(
    plotsWithCrops.length,
    Math.floor(Math.random() * (purchasedField + 1) * MAX_CROWS)
  )
  let numCropsDestroyed = 0

  for (let i = 0; i < numCrows; i++) {
    const attackPlotId = Math.floor(Math.random() * plotsWithCrops.length)
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
