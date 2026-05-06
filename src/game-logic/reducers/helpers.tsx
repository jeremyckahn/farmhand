import { itemType } from '../../enums.js'

import { SCARECROW_ITEM_ID } from '../../constants.js'
import { getPlotContentType } from '../../utils/index.js'
import { findInField } from '../../utils/findInField.js'

// This file is designed to contain common logic that is needed across multiple
// reducers.


export const setWasWateredProperty = (plotContent: any, wasWateredToday: boolean): any => {
  if (plotContent === null) {
    return null
  }

  return getPlotContentType(plotContent) === itemType.CROP
    ? { ...plotContent, wasWateredToday }
    : { ...plotContent }
}


export const setWasWatered = plotContent =>
  setWasWateredProperty(plotContent, true)


export const fieldHasScarecrow = field =>
  !!findInField(field, plotContainsScarecrow)

/**
 * @param chancesAndEvents An array of arrays in which the
 * first element is a function that determines whether to trigger an event, and
 * the second function which is a reducer that implements the event.


 */
export const applyChanceEvent = (chancesAndEvents: Array.<function[]>, state: any): any =>
  chancesAndEvents.reduce((acc, [chanceCalculator, fn]) => {
    return chanceCalculator() ? fn(acc) : acc
  }, state)


export const plotContainsScarecrow = plot =>
  !!(plot && plot.itemId === SCARECROW_ITEM_ID)

/**
 * Invokes a function on every plot in a field.



 */
export const updateField = (field: Array.<?farmhand.plotContent[]>, modifierFn: function(?farmhand.plotContent, number, number): *): Array.<?farmhand.plotContent[]> =>
  field.map((row, y) => row.map((plot, x) => modifierFn(plot, x, y)))
