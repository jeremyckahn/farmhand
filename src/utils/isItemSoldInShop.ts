import { purchasableItemMap } from './purchasableItemMap.js'

export const isItemSoldInShop = ({ id }: farmhand.item): boolean =>
  Boolean(purchasableItemMap[id])
