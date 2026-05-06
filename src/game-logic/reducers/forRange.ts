/**

 * @param fieldFn Performs an operation on each plot within the range.



 * @param args Passed as arguments to fieldFn.

 */
export const forRange = (
  state: any,
  fieldFn: function(farmhand.state, number, number, ...any): farmhand.state,
  rangeRadius: number,
  plotX: number,
  plotY: number,
  ...args
): any => {
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
