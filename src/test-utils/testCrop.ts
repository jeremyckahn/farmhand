import {
  dialogView,
  fertilizerType,
  fieldMode,
  stageFocusType,
  toolLevel,
  toolType,
} from '../enums.js'

export const testCrop = (item: any = {}): farmhand.plotContent => ({
  daysOld: 0,
  daysWatered: 0,
  fertilizerType: fertilizerType.NONE as farmhand.fertilizerType,
  itemId: 'sample-item-1',
  wasWateredToday: false,
  ...item,
})
