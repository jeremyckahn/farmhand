import { itemsMap } from '../data/maps.js'

export const getItemBaseValue = (itemId: string): number =>
  itemsMap[itemId].value
