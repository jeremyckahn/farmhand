/**
 * @param {farmhand.state} state
 * @param {function(farmhand.state, number, number, ...any)} fieldFn Performs an operation on each plot within the range.
 * @param {number} rangeRadius
 * @param {number} plotX
 * @param {number} plotY
 * @param {...any} args Passed as arguments to fieldFn.
 * @returns {farmhand.state}
 */
export const forRange = (
  state,
  fieldFn,
  rangeRadius,
  plotX,
  plotY,
  ...args
) => {
  const startX = Math.max(plotX - rangeRadius, 0)
  const endX = Math.min(plotX + rangeRadius, state.field[0].length - 1)
  const startY = Math.max(plotY - rangeRadius, 0)
  const endY = Math.min(plotY + rangeRadius, state.field.length - 1)

  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      state = fieldFn(state, x, y, ...args)
    }
  }

  return state
}
