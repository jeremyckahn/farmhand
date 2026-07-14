export const modifyForestPlotAt = (
  state: farmhand.state,
  x: number,
  y: number,
  modifierFn: (
    arg0: farmhand.plantedTree | farmhand.forestForageable | null
  ) => farmhand.plantedTree | farmhand.forestForageable | null
): farmhand.state => {
  const { forest } = state
  const currentRow = forest[y]

  if (!currentRow) {
    return state
  }

  const row = [...currentRow]
  const plotContent = modifierFn(row[x])

  row[x] = plotContent
  const modifiedForest = [...forest]

  modifiedForest[y] = row

  return { ...state, forest: modifiedForest }
}
