import { inventorySpaceRemaining } from './inventorySpaceRemaining.js'

export const doesInventorySpaceRemain = (
  state: Pick<farmhand.state, 'inventory' | 'inventoryLimit'>
): boolean => inventorySpaceRemaining(state) > 0
