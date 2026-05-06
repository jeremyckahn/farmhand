// TODO: Add tests for this reducer.

export const modifyFieldPlotAt = (state: any, x: number, y: number, modifierFn: function(?farmhand.plotContent): ?farmhand.plotContent): any => {
  const { field } = state
  const row = [...field[y]]
  const plotContent = modifierFn(row[x])
  row[x] = plotContent
  const modifiedField = [...field]
  modifiedField[y] = row

  return { ...state, field: modifiedField }
}
