import * as reducers from '../game-logic/reducers/index.js'
import { testCrop } from '../test-utils/index.js'

import { toolLevel, toolType } from '../enums.js'

import { INFINITE_STORAGE_LIMIT } from '../constants.js'

import { achievementsMap, progressAchievement } from './achievements.js'
import { carrot } from './crops/index.js'

describe('progressAchievement', () => {
  test('condition is false and getProgress reflects currentValue below goal', () => {
    const { condition, getProgress } = progressAchievement(10, () => 9)

    expect(condition({} as any)).toEqual(false)
    expect(getProgress?.({} as any)).toEqual({ currentValue: 9, goal: 10 })
  })

  test('condition is true and getProgress reflects currentValue at goal', () => {
    const { condition, getProgress } = progressAchievement(10, () => 10)

    expect(condition({} as any)).toEqual(true)
    expect(getProgress?.({} as any)).toEqual({ currentValue: 10, goal: 10 })
  })

  test('condition is true and getProgress reflects currentValue above goal', () => {
    const { condition, getProgress } = progressAchievement(10, () => 11)

    expect(condition({} as any)).toEqual(true)
    expect(getProgress?.({} as any)).toEqual({ currentValue: 11, goal: 10 })
  })
})

describe('harvest-crop', () => {
  describe('condition', () => {
    let inputState: any

    beforeEach(() => {
      inputState = {
        cropsHarvested: {},
        field: [[null, null, testCrop({ itemId: carrot.id, daysWatered: 5 })]],
        inventory: [],
        inventoryLimit: INFINITE_STORAGE_LIMIT,
        toolLevels: {
          [toolType.SCYTHE]: toolLevel.DEFAULT,
        },
      }
    })

    describe('is not met', () => {
      test('returns false', () => {
        expect(
          achievementsMap['harvest-crop'].condition(inputState, inputState)
        ).toEqual(false)
      })
    })

    describe('is met', () => {
      test('returns true', () => {
        expect(
          achievementsMap['harvest-crop'].condition(
            reducers.harvestPlot(inputState, 2, 0),
            inputState
          )
        ).toEqual(true)
      })
    })
  })
})

const iAmRichVariants = [
  ['i-am-rich-1', 500000, 'Earn $500,000.', 'All sales receive a 5% bonus'],
  ['i-am-rich-2', 1000000, 'Earn $1,000,000.', 'All sales receive a 10% bonus'],
  [
    'i-am-rich-3',
    1000000000,
    'Earn $1,000,000,000.',
    'All sales receive a 25% bonus',
  ],
]

describe.each(iAmRichVariants)(
  'I am Rich variants',
  (id, goal, description, rewardDescription) => {
    describe(id, () => {
      test('has the expected description', () => {
        expect(achievementsMap[id].description).toEqual(description)
      })

      test('has the expected rewardDescription', () => {
        expect(achievementsMap[id].rewardDescription).toEqual(rewardDescription)
      })

      test(`is achieved when revenue is greater than or equal to ${goal}`, () => {
        const achievement = achievementsMap[id]
        const state = {
          revenue: goal,
        } as any

        expect(achievement.condition(state)).toEqual(true)
      })

      test(`is not achieved when revenue is less than ${goal}`, () => {
        const achievement = achievementsMap[id]
        const state = {
          revenue: Number(goal) - 1,
        } as any

        expect(achievement.condition(state)).toEqual(false)
      })

      test('reports progress toward the revenue goal', () => {
        const achievement = achievementsMap[id]
        const state = {
          revenue: Number(goal) - 1,
        } as any

        expect(achievement.getProgress?.(state)).toEqual({
          currentValue: Number(goal) - 1,
          goal: Number(goal),
        })
      })
    })
  }
)

describe('gold-digger', () => {
  const achievement = achievementsMap['gold-digger']
  let state: any

  beforeEach(() => {
    state = {
      inventory: [{ id: 'gold-ore' }],
      inventoryLimit: 99,
    }
  })

  test('is achieved when the player acquires a piece of gold ore', () => {
    expect(achievement.condition(state)).toEqual(true)
  })

  test('it rewards the player with a gold ingot', () => {
    state = achievement.reward(state)

    const ingot = state.inventory.find(
      (item: { id: string }) => item.id === 'gold-ingot'
    )

    expect(ingot).toEqual({ id: 'gold-ingot', quantity: 1 })
  })
})

describe('financial-freedom', () => {
  const achievement = achievementsMap['financial-freedom']
  let state: any

  beforeEach(() => {
    state = {
      loanBalance: 100,
    }
  })

  test('is not achievemed when loan balance is greater than 0', () => {
    expect(achievement.condition(state)).toEqual(false)
  })

  test('is achievemented when the loan balance is at 0', () => {
    state.loanBalance = 0

    expect(achievement.condition(state)).toEqual(true)
  })
})

describe('orchardist', () => {
  const achievement = achievementsMap['orchardist']
  let state: any

  beforeEach(() => {
    state = {
      treeFruitsHarvested: { apple: 999 },
      inventory: [],
      inventoryLimit: INFINITE_STORAGE_LIMIT,
    }
  })

  test('is not achieved when fewer than 1000 fruits have been picked', () => {
    expect(achievement.condition(state)).toEqual(false)
  })

  test('is achieved when 1000 or more fruits have been picked', () => {
    state.treeFruitsHarvested.apple = 1000

    expect(achievement.condition(state)).toEqual(true)
  })

  test('sums fruits across multiple tree species', () => {
    state.treeFruitsHarvested = { apple: 500, pear: 500 }

    expect(achievement.condition(state)).toEqual(true)
  })

  test('rewards the player with apple saplings', () => {
    state = achievement.reward(state)

    const saplings = state.inventory.find(
      (item: { id: string }) => item.id === 'apple-sapling'
    )

    expect(saplings).toEqual({ id: 'apple-sapling', quantity: 50 })
  })

  test('reports progress toward the fruits-picked goal', () => {
    expect(achievement.getProgress?.(state)).toEqual({
      currentValue: 999,
      goal: 1000,
    })
  })
})

describe('piemaker', () => {
  const achievement = achievementsMap['piemaker']
  let state: any

  beforeEach(() => {
    state = {
      recipesMade: { 'apple-pie': 99 },
      money: 0,
    }
  })

  test('is not achieved when fewer than 100 pies have been made', () => {
    expect(achievement.condition(state)).toEqual(false)
  })

  test('is achieved when 100 or more pies have been made', () => {
    state.recipesMade['apple-pie'] = 100

    expect(achievement.condition(state)).toEqual(true)
  })

  test('sums pies across all pie recipes', () => {
    state.recipesMade = {
      'chickn-pot-pie': 25,
      'pumpkin-pie': 25,
      'apple-pie': 25,
      'sweet-potato-pie': 25,
    }

    expect(achievement.condition(state)).toEqual(true)
  })

  test('does not count non-pie recipes', () => {
    state.recipesMade = { mulch: 1000 }

    expect(achievement.condition(state)).toEqual(false)
  })

  test('rewards the player with money', () => {
    state = achievement.reward(state)

    expect(state.money).toEqual(100_000)
  })

  test('reports progress toward the pies-made goal', () => {
    expect(achievement.getProgress?.(state)).toEqual({
      currentValue: 99,
      goal: 100,
    })
  })
})

describe('deforestation', () => {
  const achievement = achievementsMap['deforestation']
  let state: any

  beforeEach(() => {
    state = {
      treesChopped: 249,
      inventory: [],
      inventoryLimit: INFINITE_STORAGE_LIMIT,
    }
  })

  test('is not achieved when fewer than 250 trees have been chopped', () => {
    expect(achievement.condition(state)).toEqual(false)
  })

  test('is achieved when 250 or more trees have been chopped', () => {
    state.treesChopped = 250

    expect(achievement.condition(state)).toEqual(true)
  })

  test('rewards the player with wood', () => {
    state = achievement.reward(state)

    const wood = state.inventory.find(
      (item: { id: string }) => item.id === 'wood'
    )

    expect(wood).toEqual({ id: 'wood', quantity: 500 })
  })

  test('reports progress toward the trees-chopped goal', () => {
    expect(achievement.getProgress?.(state)).toEqual({
      currentValue: 249,
      goal: 250,
    })
  })
})

describe('landscaper', () => {
  const achievement = achievementsMap['landscaper']
  let state: any

  beforeEach(() => {
    state = {
      mulchApplied: { mulch: 99 },
      inventory: [],
      inventoryLimit: INFINITE_STORAGE_LIMIT,
    }
  })

  test('is not achieved when fewer than 100 bags of mulch have been applied', () => {
    expect(achievement.condition(state)).toEqual(false)
  })

  test('is achieved when 100 or more bags of mulch have been applied', () => {
    state.mulchApplied.mulch = 100

    expect(achievement.condition(state)).toEqual(true)
  })

  test('sums mulch applications across mulch types', () => {
    state.mulchApplied = { mulch: 50, 'rainbow-mulch': 50 }

    expect(achievement.condition(state)).toEqual(true)
  })

  test('rewards the player with rainbow mulch', () => {
    state = achievement.reward(state)

    const rainbowMulch = state.inventory.find(
      (item: { id: string }) => item.id === 'rainbow-mulch'
    )

    expect(rainbowMulch).toEqual({ id: 'rainbow-mulch', quantity: 25 })
  })

  test('reports progress toward the mulch-applied goal', () => {
    expect(achievement.getProgress?.(state)).toEqual({
      currentValue: 99,
      goal: 100,
    })
  })
})

describe('farmhand-shuffle-first-match', () => {
  const achievement = achievementsMap['farmhand-shuffle-first-match']
  let state: any

  beforeEach(() => {
    state = {
      farmhandShuffle: { totalMatchesPlayed: 0 },
      money: 0,
    }
  })

  test('is not achieved when no matches have been played', () => {
    expect(achievement.condition(state)).toEqual(false)
  })

  test('is achieved once a match has been played', () => {
    state.farmhandShuffle.totalMatchesPlayed = 1

    expect(achievement.condition(state)).toEqual(true)
  })

  test('is achieved even when the played match was a draw (no wins or losses)', () => {
    // A draw only increments totalMatchesPlayed, not totalWins/totalLosses -
    // this achievement must not require those to be truthy.
    state.farmhandShuffle.totalMatchesPlayed = 1

    expect(achievement.condition(state)).toEqual(true)
  })

  test('rewards the player with money', () => {
    const nextState = achievement.reward(state)

    expect(nextState.money).toBeGreaterThan(state.money)
  })
})

const winStreakVariants = [
  ['farmhand-shuffle-win-streak-1', 3],
  ['farmhand-shuffle-win-streak-2', 5],
  ['farmhand-shuffle-win-streak-3', 10],
]

describe.each(winStreakVariants)(
  'Farmhand Shuffle win-streak variants',
  (id, goal) => {
    describe(id as string, () => {
      const achievement = achievementsMap[id as string]
      let state: any

      beforeEach(() => {
        state = {
          farmhandShuffle: { currentWinStreak: 0 },
          money: 0,
        }
      })

      test(`is not achieved when the current win streak is below ${goal}`, () => {
        state.farmhandShuffle.currentWinStreak = (goal as number) - 1

        expect(achievement.condition(state)).toEqual(false)
      })

      test(`is achieved when the current win streak reaches ${goal}`, () => {
        state.farmhandShuffle.currentWinStreak = goal

        expect(achievement.condition(state)).toEqual(true)
      })

      test('reports progress toward the win-streak goal', () => {
        state.farmhandShuffle.currentWinStreak = 1

        expect(achievement.getProgress?.(state)).toEqual({
          currentValue: 1,
          goal,
        })
      })

      test('rewards the player with money', () => {
        state.farmhandShuffle.currentWinStreak = goal

        const nextState = achievement.reward(state)

        expect(nextState.money).toBeGreaterThan(state.money)
      })
    })
  }
)
