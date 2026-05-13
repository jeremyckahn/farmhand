export const updatePlotShoveledState = (
  plotContent: farmhand.plotContent | null
): farmhand.plotContent | null => {
  if (
    plotContent &&
    plotContent.isShoveled &&
    plotContent.daysUntilClear !== undefined &&
    plotContent.daysUntilClear > 1
  ) {
    return {
      ...plotContent,
      daysUntilClear: plotContent.daysUntilClear - 1,
    }
  }

  return plotContent && !plotContent.isShoveled ? plotContent : null
}
