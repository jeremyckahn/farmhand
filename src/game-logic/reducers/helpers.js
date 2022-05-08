import { SCARECROW_ITEM_ID } from '../../constants'
import { findInField } from '../../utils'

/**
 * @param {Array.<Array.<?farmhand.plotContent>>} field
 * @returns {boolean}
 */
export const fieldHasScarecrow = field =>
  findInField(field, plotContainsScarecrow)

/**
 * @param {Array} chancesAndEvents An array of arrays in which the first
 * element is a number and the second number is a function.
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const applyChanceEvent = (chancesAndEvents, state) =>
  chancesAndEvents.reduce(
    (acc, [chance, fn]) => (Math.random() <= chance ? fn(acc) : acc),
    state
  )

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
