export const isPlantedTree = (
  plotContent: farmhand.plantedTree | farmhand.forestForageable | null
): plotContent is farmhand.plantedTree =>
  Boolean(plotContent && 'itemId' in plotContent)
