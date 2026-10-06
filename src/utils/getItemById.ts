import { itemsMap } from '../data/maps.js'

/**
 * @throws If no item exists for the provided id.
 */
export const getItemById = (id: string): farmhand.item => {
  const item = itemsMap[id as keyof typeof itemsMap]

  if (!item) {
    throw new Error(`Unknown item id: ${id}`)
  }

  return item
}
