/**
 * @param {?farmhand.plotContent} plotContent
 * @returns {?farmhand.plotContent}
 */
export const updatePlotShoveledState = plotContent => {
  if (plotContent && plotContent.isShoveled && plotContent.daysUntilClear > 1) {
    return {
      ...plotContent,
      daysUntilClear: plotContent.daysUntilClear - 1,
    }
  }

  return plotContent && !plotContent.isShoveled ? plotContent : null
}
