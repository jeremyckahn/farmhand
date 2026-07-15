import { features } from '../config.js'

import {
  // Plantable trees
  appleSapling,

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
} from './items.js'

import { fertilizer } from './recipes.js'

const inventory: farmhand.item[] = [
  // Plantable trees
  ...((features as { FOREST?: boolean }).FOREST ? [appleSapling] : []),

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
]

export default inventory

export const itemIds = new Set(inventory.map(item => item.id))
