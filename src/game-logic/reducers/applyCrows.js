import { itemType } from '../../enums'
import { itemsMap } from '../../data/maps'
import { getPlotContentType } from '../../utils'
import { CROW_CHANCE } from '../../constants'
import { CROW_ATTACKED } from '../../templates'

import { fieldHasScarecrow, updateField } from './helpers'

// TODO: Add tests for this reducer.
/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const applyCrows = state => {
  const { field } = state
  const newDayNotifications = [...state.newDayNotifications]

  let notificationMessages = []

  const updatedField = fieldHasScarecrow(field)
    ? field
    : updateField(field, plotContent => {
        if (!plotContent || getPlotContentType(plotContent) !== itemType.CROP) {
          return plotContent
        }

        const destroyCrop = Math.random() <= CROW_CHANCE

        if (destroyCrop) {
          notificationMessages.push(
            CROW_ATTACKED`${itemsMap[plotContent.itemId]}`
          )
        }

        return destroyCrop ? null : plotContent
      })

  if (notificationMessages.length) {
    newDayNotifications.push({
      message: notificationMessages.join('\n\n'),
      severity: 'error',
    })
  }

  return { ...state, field: updatedField, newDayNotifications }
}
