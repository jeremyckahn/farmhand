import { memoize } from './memoize.js'

export const inventorySpaceConsumed = memoize(
  (inventory: Array<{ quantity?: number }>): number =>
    inventory.reduce((sum, { quantity = 0 }) => sum + quantity, 0),
  {}
)
