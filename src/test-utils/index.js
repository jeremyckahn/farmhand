import { fertilizerType } from '../enums'

export const shapeOf = object =>
  Object.keys(object).reduce((acc, key) => {
    acc[key] = typeof object[key]
    return acc
  }, {})

export const testCrop = (item = {}) => ({
  daysOld: 0,
  daysWatered: 0,
  fertilizerType: fertilizerType.NONE,
  itemId: 'sample-item-1',
  wasWateredToday: false,
  ...item,
})

/**
 * @param {farmhand.shoveledPlot} plotProps
 */
export const testShoveledPlot = plotProps => ({
  isShoveled: true,
  daysUntilClear: 5,
  ...plotProps,
})

export const testItem = (item = {}) => ({
  playerId: '',
  name: '',
  value: 0,
  ...item,
})
