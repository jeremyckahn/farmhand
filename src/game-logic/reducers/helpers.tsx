import { itemType } from '../../enums.js'

import { SCARECROW_ITEM_ID } from '../../constants.js'
import { getPlotContentType } from '../../utils/index.js'
import { findInField } from '../../utils/findInField.js'

// This file is designed to contain common logic that is needed across multiple
// reducers.

/**
 * @param plotContent
 * @param wasWateredToday
 * @returns {?farmhand.plotContent}
 */
export const setWasWateredProperty = (plotContent, wasWateredToday) => {
  if (plotContent === null) {
    return null
  }

  return getPlotContentType(plotContent) === itemType.CROP
    ? { ...plotContent, wasWateredToday }
    : { ...plotContent }
}

/**
 * @param plotContent
 * @returns {?farmhand.plotContent}
 */
export const setWasWatered = plotContent =>
  setWasWateredProperty(plotContent, true)

/**
 * @param field
 * @returns {boolean}
 */
export const fieldHasScarecrow = field =>
  !!findInField(field, plotContainsScarecrow)

/**
 * @param chancesAndEvents An array of arrays in which the
 * first element is a function that determines whether to trigger an event, and
 * the second function which is a reducer that implements the event.
 * @param state
 * @returns {farmhand.state}
 */
export const applyChanceEvent = (chancesAndEvents, state) =>
  chancesAndEvents.reduce((acc, [chanceCalculator, fn]) => {
    return chanceCalculator() ? fn(acc) : acc
  }, state)

/**
 * @param plot
 * @returns {boolean}
 */
export const plotContainsScarecrow = plot =>
  !!(plot && plot.itemId === SCARECROW_ITEM_ID)

/**
 * Invokes a function on every plot in a field.
 * @param field
 * @param modifierFn
 * @returns {Array.<Array.<?farmhand.plotContent>>}
 */
export const updateField = (field, modifierFn) =>
  field.map((row, y) => row.map((plot, x) => modifierFn(plot, x, y)))
