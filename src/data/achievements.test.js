import * as reducers from '../game-logic/reducers/index.js'
import { testCrop } from '../test-utils/index.js'

import { toolLevel, toolType } from '../enums.js'

import { INFINITE_STORAGE_LIMIT } from '../constants.js'

import { achievementsMap } from './achievements.js'
import { carrot } from './crops/index.js'

describe('harvest-crop', () => {
  describe('condition', () => {
    let inputState

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
        }

        expect(achievement.condition(state)).toEqual(true)
      })

      test(`is not achieved when revenue is less than ${goal}`, () => {
        const achievement = achievementsMap[id]
        const state = {
          revenue: /** @type {number} */ (goal) - 1,
        }

        expect(achievement.condition(state)).toEqual(false)
      })
    })
  }
)

describe('gold-digger', () => {
  const achievement = achievementsMap['gold-digger']
  let state

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

    const ingot = state.inventory.find(item => item.id === 'gold-ingot')

    expect(ingot).toEqual({ id: 'gold-ingot', quantity: 1 })
  })
})

describe('financial-freedom', () => {
  const achievement = achievementsMap['financial-freedom']
  let state

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
