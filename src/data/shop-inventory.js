import {
  // Plantable crops
  asparagusSeed,
  carrotSeed,
  cornSeed,
  jalapenoSeed,
  onionSeed,
  potatoSeed,
  pumpkinSeed,
  soybeanSeed,
  spinachSeed,
  tomatoSeed,
  wheatSeed,

  // Field items
  fertilizer,
  scarecrow,
  sprinkler,
} from './items'

const shopInventory = [
  // Plantable crops
  asparagusSeed,
  carrotSeed,
  cornSeed,
  jalapenoSeed,
  onionSeed,
  potatoSeed,
  pumpkinSeed,
  soybeanSeed,
  spinachSeed,
  tomatoSeed,
  wheatSeed,

  // Field items
  fertilizer,
  scarecrow,
  sprinkler,
]

export default shopInventory

export const shopItemIds = new Set(shopInventory.map(item => item.id))
