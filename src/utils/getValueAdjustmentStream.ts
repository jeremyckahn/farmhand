import { valueAdjustmentStream } from '../enums.js'

export const getValueAdjustmentStream = (itemId: string) =>
  `valueAdjustment:${itemId}` as valueAdjustmentStream
