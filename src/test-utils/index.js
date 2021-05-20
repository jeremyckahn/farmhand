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

export const testItem = (item = {}) => ({
  id: '',
  name: '',
  value: 0,
  ...item,
})
