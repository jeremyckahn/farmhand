import {
  dialogView,
  fertilizerType,
  fieldMode,
  stageFocusType,
  toolLevel,
  toolType,
} from '../enums.js'

export const shapeOf = object =>
  Object.keys(object).reduce((acc, key) => {
    acc[key] = typeof object[key]
    return acc
  }, {})
