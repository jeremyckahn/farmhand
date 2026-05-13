// TODO: Add tests for this reducer.
export const modifyFieldPlotAt = (
  state: farmhand.state,
  x: number,
  y: number,
  modifierFn: (arg0: farmhand.plotContent | null) => farmhand.plotContent | null
): farmhand.state => {
  const { field } = state
  const row = [...field[y]]
  const plotContent = modifierFn(row[x])
  row[x] = plotContent
  const modifiedField = [...field]
  modifiedField[y] = row

  return { ...state, field: modifiedField }
}
