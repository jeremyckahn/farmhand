import { valueAdjustmentStream } from '../enums.js'

export const getValueAdjustmentStream = (
  itemId: string
): valueAdjustmentStream => `valueAdjustment:${itemId}`
