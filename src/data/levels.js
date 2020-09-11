import * as items from './items'

export default [
  {
    unlocksShopItem: items.spinach.id,
  },
  {
    increasesSprinklerRange: true,
  },
].map((level, i) => ({ ...level, id: i + 2 }))
