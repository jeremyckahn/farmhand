import { itemsMap } from '../data/maps.js'

export const getResaleValue = ({ id }: farmhand.item): number =>
  itemsMap[id].value / 2
