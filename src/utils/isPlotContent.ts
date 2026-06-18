export const isPlotContent = (obj: any = {}): obj is farmhand.plotContent =>
  Boolean(obj && obj['itemId'] && obj['fertilizerType'])
