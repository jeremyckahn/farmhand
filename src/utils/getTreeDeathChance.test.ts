import {
  TREE_DEATH_CHANCE_BASE,
  TREE_DEATH_CHANCE_INCREMENT_PER_DAY,
  TREE_DEATH_CHANCE_MAX,
} from '../constants.js'

import { getTreeDeathChance } from './getTreeDeathChance.js'

describe('getTreeDeathChance', () => {
  test('is the base chance on the first day past lifespan', () => {
    expect(getTreeDeathChance(0)).toBe(TREE_DEATH_CHANCE_BASE)
  })

  test('increases linearly with days past lifespan', () => {
    expect(getTreeDeathChance(1)).toBe(
      TREE_DEATH_CHANCE_BASE + TREE_DEATH_CHANCE_INCREMENT_PER_DAY
    )
    expect(getTreeDeathChance(2)).toBe(
      TREE_DEATH_CHANCE_BASE + TREE_DEATH_CHANCE_INCREMENT_PER_DAY * 2
    )
  })

  test('is capped at TREE_DEATH_CHANCE_MAX', () => {
    expect(getTreeDeathChance(1000)).toBe(TREE_DEATH_CHANCE_MAX)
  })
})
