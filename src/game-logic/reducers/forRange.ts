/**
 * @param state
 * @param fieldFn Performs an operation on each plot within the range.
 * @param rangeRadius
 * @param plotX
 * @param plotY
 * @param args Passed as arguments to fieldFn.
 * @returns
 */
export const forRange = (
  state: farmhand.state,
  fieldFn: (
    s: farmhand.state,
    x: number,
    y: number,
    ...args: any[]
  ) => farmhand.state,
  rangeRadius: number,
  plotX: number,
  plotY: number,
  ...args: any[]
): farmhand.state => {
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
