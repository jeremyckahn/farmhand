import { HUGGING_MACHINE_ITEM_ID } from '../constants.js'

import { memoize } from './memoize.js'

export const areHuggingMachinesInInventory = memoize(
  (inventory: farmhand.state['inventory']): boolean =>
    inventory.some(({ id }) => id === HUGGING_MACHINE_ITEM_ID)
)
