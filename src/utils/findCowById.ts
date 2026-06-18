import { memoize } from './memoize.js'

export const findCowById = memoize(
  (cowInventory: Array<farmhand.cow>, id: string): farmhand.cow | undefined =>
    cowInventory.find(cow => id === cow.id)
)
