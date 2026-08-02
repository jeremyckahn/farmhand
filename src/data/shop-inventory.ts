import {
  // Plantable trees
  appleSapling,
  bananaSapling,

  // Plantable crops
  asparagusSeed,
  carrotSeed,
  cornSeed,
  grapeSeed,
  garlicSeed,
  jalapenoSeed,
  oliveSeed,
  onionSeed,
  peaSeed,
  potatoSeed,
  pumpkinSeed,
  soybeanSeed,
  spinachSeed,
  sunflowerSeed,
  strawberrySeed,
  sugarcaneSeed,
  sweetPotatoSeed,
  tomatoSeed,
  watermelonSeed,
  wheatSeed,

  // Field items
  scarecrow,
  sprinkler,

  // Cow items
  cowFeed,
  huggingMachine,
} from './items.js'

import { fertilizer, mulch } from './recipes.js'

const inventory: farmhand.item[] = [
  // Plantable trees
  appleSapling,
  bananaSapling,

  // Forest items
  mulch,

  // Plantable crops
  asparagusSeed,
  carrotSeed,
  cornSeed,
  grapeSeed,
  garlicSeed,
  jalapenoSeed,
  oliveSeed,
  onionSeed,
  peaSeed,
  potatoSeed,
  pumpkinSeed,
  soybeanSeed,
  spinachSeed,
  sunflowerSeed,
  strawberrySeed,
  sugarcaneSeed,
  sweetPotatoSeed,
  tomatoSeed,
  watermelonSeed,
  wheatSeed,

  // Field items
  fertilizer,
  scarecrow,
  sprinkler,

  // Cow items
  cowFeed,
  huggingMachine,
]

export default inventory

export const itemIds = new Set(inventory.map(item => item.id))
