export const isShoveledPlot = (obj: any = {}): obj is farmhand.shoveledPlot =>
  Boolean(obj && obj['isShoveled'] && obj['daysUntilClear'])
