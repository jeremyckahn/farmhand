import { itemType } from '../../enums'

import { SCARECROW_ITEM_ID } from '../../constants'
import { getPlotContentType } from '../../utils'
import { findInField } from '../../utils/findInField'

// This file is designed to contain common logic that is needed across multiple
// reducers.

/**
 * @param {?farmhand.plotContent} plotContent
 * @param {boolean} wasWateredToday
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
 * @param {?farmhand.plotContent} plotContent
 * @returns {?farmhand.plotContent}
 */
export const setWasWatered = plotContent =>
  setWasWateredProperty(plotContent, true)

/**
 * @param {Array.<Array.<?farmhand.plotContent>>} field
 * @returns {boolean}
 */
export const fieldHasScarecrow = field =>
  findInField(field, plotContainsScarecrow)

/**
 * @param {Array.<function>} chancesAndEvents An array of arrays in which the
 * first element is a function that determines whether to trigger an event, and
 * the second function which is a reducer that implements the event.
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const applyChanceEvent = (chancesAndEvents, state) =>
  chancesAndEvents.reduce((acc, [chanceCalculator, fn]) => {
    return chanceCalculator() ? fn(acc) : acc
  }, state)

/**
 * @param {?farmhand.plotContent} plot
 * @returns {boolean}
 */
export const plotContainsScarecrow = plot =>
  plot && plot.itemId === SCARECROW_ITEM_ID

/**
 * Invokes a function on every plot in a field.
 * @param {Array.<Array.<?farmhand.plotContent>>} field
 * @param {Function(?farmhand.plotContent)} modifierFn
 * @returns {Array.<Array.<?farmhand.plotContent>>}
 */
export const updateField = (field, modifierFn) =>
  field.map((row, y) => row.map((plot, x) => modifierFn(plot, x, y)))
