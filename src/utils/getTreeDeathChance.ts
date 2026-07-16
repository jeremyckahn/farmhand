import {
  TREE_DEATH_CHANCE_BASE,
  TREE_DEATH_CHANCE_INCREMENT_PER_DAY,
  TREE_DEATH_CHANCE_MAX,
} from '../constants.js'

export const getTreeDeathChance = (daysPastLifespan: number): number =>
  Math.min(
    TREE_DEATH_CHANCE_MAX,
    TREE_DEATH_CHANCE_BASE +
      daysPastLifespan * TREE_DEATH_CHANCE_INCREMENT_PER_DAY
  )
