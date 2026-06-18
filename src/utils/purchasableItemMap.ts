import cowShopInventory from '../data/shop-inventory-cow.js'
import shopInventory from '../data/shop-inventory.js'

export const purchasableItemMap = [
  ...cowShopInventory,
  ...shopInventory,
].reduce((acc: Record<string, farmhand.item>, item) => {
  acc[item.id] = item
  return acc
}, {})
