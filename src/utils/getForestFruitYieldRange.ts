// The [min, max] (inclusive) fruit count a harvest/chop would yield,
// without rolling an actual amount - shared by the harvestForestPlot and
// chopForestPlot reducers (which roll a number in this range) and the
// forest plot tooltip (which just displays the range). Mirrors
// getChopWoodYieldRange.ts's role for wood.
export const getForestFruitYieldRange = (
  item: farmhand.item
): [number, number] => item.fruitYieldRange ?? [1, 1]
