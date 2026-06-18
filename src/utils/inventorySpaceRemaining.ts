import { INFINITE_STORAGE_LIMIT } from '../constants.js'

import { inventorySpaceConsumed } from './inventorySpaceConsumed.js'

export const inventorySpaceRemaining = ({
  inventory,
  inventoryLimit,
}: Pick<farmhand.state, 'inventory' | 'inventoryLimit'>): number =>
  inventoryLimit === INFINITE_STORAGE_LIMIT
    ? Infinity
    : Math.max(0, inventoryLimit - inventorySpaceConsumed(inventory))
