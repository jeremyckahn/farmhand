import { random } from '../../common/utils.js'
import { doesPlotContainCrop } from '../../utils/index.js'
import { CROW_CHANCE, MAX_CROWS } from '../../constants.js'
import { CROWS_DESTROYED } from '../../templates.js'

import { randomNumberService } from '../../common/services/randomNumber.js'

import { modifyFieldPlotAt } from './modifyFieldPlotAt.js'
import { fieldHasScarecrow } from './helpers.js'

export function forEachPlot(
  state: farmhand.state,
  callback: (
    plotContents: farmhand.plotContent | null,
    x: number,
    y: number
  ) => void
) {
  state.field.forEach((row, y) =>
    row.forEach((plotContents, x) => callback(plotContents, x, y))
  )
}

export const applyCrows = (state: farmhand.state): farmhand.state => {
  const { field, purchasedField } = state

  if (
    fieldHasScarecrow(field) ||
    randomNumberService.isRandomNumberLessThan(1 - CROW_CHANCE)
  ) {
    return state
  }

  const newDayNotifications = [...state.newDayNotifications]

  let notificationMessages: string[] = []
  const plotsWithCrops: Array<{ x: number; y: number }> = []

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
    notificationMessages.push(CROWS_DESTROYED('', numCropsDestroyed) as string)
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
