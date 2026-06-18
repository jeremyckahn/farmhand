import {
  dialogView,
  fertilizerType,
  fieldMode,
  stageFocusType,
  toolLevel,
  toolType,
} from '../enums.js'

export const testItem = (item: any = {}): farmhand.item => ({
  id: '',
  name: '',
  type: 'CRAFTED_ITEM' as farmhand.itemType,
  value: 0,
  description: '',
  doesPriceFluctuate: false,
  isReplantable: false,
  quantity: 1,
  ...item,
})
