import * as reducers from '../game-logic/reducers/index.js'
import { testCrop } from '../test-utils/index.js'

import { toolLevel, toolType } from '../enums.js'

import { INFINITE_STORAGE_LIMIT } from '../constants.js'

import { achievementsMap } from './achievements.js'
import { carrot } from './crops/index.js'

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

    expect(saplings).toEqual({ id: 'apple-sapling', quantity: 15 })
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

    expect(state.money).toEqual(5000)
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
})
