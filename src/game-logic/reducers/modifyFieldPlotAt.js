// TODO: Add tests for this reducer.
/**
 * @param {farmhand.state} state
 * @param {number} x
 * @param {number} y
 * @param {Function(?farmhand.plotContent)} modifierFn
 * @returns {farmhand.state}
 */
export const modifyFieldPlotAt = (state, x, y, modifierFn) => {
  const { field } = state
  const row = [...field[y]]
  const plotContent = modifierFn(row[x])
  row[x] = plotContent
  const modifiedField = [...field]
  modifiedField[y] = row

  return { ...state, field: modifiedField }
}
