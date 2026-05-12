import { itemType } from '../../enums.js'

import { SCARECROW_ITEM_ID } from '../../constants.js'
import { getPlotContentType } from '../../utils/index.js'
import { findInField } from '../../utils/findInField.js'

// This file is designed to contain common logic that is needed across multiple
// reducers.

export const setWasWateredProperty = (
  plotContent: farmhand.plotContent | null,
  wasWateredToday: boolean
): farmhand.plotContent | null => {
  if (plotContent === null) {
    return null
  }

  return getPlotContentType(plotContent) === itemType.CROP
    ? { ...(plotContent as farmhand.crop), wasWateredToday }
    : { ...plotContent }
}

export const setWasWatered = (
  plotContent: farmhand.plotContent | null
): farmhand.plotContent | null => setWasWateredProperty(plotContent, true)

export const fieldHasScarecrow = (
  field: Array<Array<farmhand.plotContent | null>> | null
): boolean => !!(field && findInField(field, plotContainsScarecrow))

/**
 * @param chancesAndEvents An array of arrays in which the
first element is a function that determines whether to trigger an event, and
the second function which is a reducer that implements the event.
 */
export const applyChanceEvent = (
  chancesAndEvents: Array<
    [() => boolean, (state: farmhand.state) => farmhand.state]
  >,
  state: farmhand.state
): farmhand.state =>
  chancesAndEvents.reduce((acc, [chanceCalculator, fn]) => {
    return chanceCalculator() ? fn(acc) : acc
  }, state)

export const plotContainsScarecrow = (
  plot: farmhand.plotContent | null
): boolean => !!(plot && plot.itemId === SCARECROW_ITEM_ID)

/**
 * Invokes a function on every plot in a field.
 */
export function updateField(
  field: Array<Array<farmhand.plotContent | null>>,
  modifierFn: (
    arg0: farmhand.plotContent | null,
    arg1: number,
    arg2: number
  ) => farmhand.plotContent | null
): Array<Array<farmhand.plotContent | null>>

export function updateField(
  field: null | undefined,
  modifierFn: (
    arg0: farmhand.plotContent | null,
    arg1: number,
    arg2: number
  ) => farmhand.plotContent | null
): null

export function updateField(
  field: Array<Array<farmhand.plotContent | null>> | null | undefined,
  modifierFn: (
    arg0: farmhand.plotContent | null,
    arg1: number,
    arg2: number
  ) => farmhand.plotContent | null
): Array<Array<farmhand.plotContent | null>> | null {
  if (!field) return null
  return field.map((row, y) => row.map((plot, x) => modifierFn(plot, x, y)))
}
