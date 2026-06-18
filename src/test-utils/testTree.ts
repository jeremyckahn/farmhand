import {
  dialogView,
  fertilizerType,
  fieldMode,
  stageFocusType,
  toolLevel,
  toolType,
} from '../enums.js'

export const testTree = (item: any = {}): farmhand.plantedTree => ({
  daysOld: 0,
  itemId: 'test-tree',
  ...item,
})
