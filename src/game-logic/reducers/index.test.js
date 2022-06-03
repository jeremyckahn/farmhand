import { testCrop } from '../../test-utils'
import {
  ACHIEVEMENT_COMPLETED,
  LOAN_INCREASED,
  LOAN_PAYOFF,
} from '../../templates'
import {
  COW_HUG_BENEFIT,
  MAX_ANIMAL_NAME_LENGTH,
  MAX_LATEST_PEER_MESSAGES,
  MAX_PENDING_PEER_MESSAGES,
} from '../../constants'
import { generateCow } from '../../utils'

import * as fn from './'

jest.mock('../../data/achievements')
jest.mock('../../data/maps')
jest.mock('../../data/items')
jest.mock('../../data/levels', () => ({ levels: [], itemUnlockLevels: {} }))
jest.mock('../../data/recipes')
jest.mock('../../data/shop-inventory')
jest.mock('../../utils/isRandomNumberLessThan')

jest.mock('../../constants', () => ({
  __esModule: true,
  ...jest.requireActual('../../constants'),
  COW_HUG_BENEFIT: 0.5,
  CROW_CHANCE: 0,
  PRECIPITATION_CHANCE: 0,
}))

describe('selectCow', () => {
  test('updates selectedCowId', () => {
    const { selectedCowId } = fn.selectCow({}, { id: 'abc' })
    expect(selectedCowId).toEqual('abc')
  })
})

describe('hugCow', () => {
  describe('cow has not hit daily hug benefit limit', () => {
    test('increases cow happiness', () => {
      const cow = generateCow()
      const {
        cowInventory: [{ happiness, happinessBoostsToday }],
      } = fn.hugCow(
        {
          cowInventory: [cow],
        },
        cow.id
      )

      expect(happiness).toBe(COW_HUG_BENEFIT)
      expect(happinessBoostsToday).toBe(1)
    })

    describe('cow is at max happiness', () => {
      test('does not increase cow happiness', () => {
        const cow = generateCow({ happiness: 1 })
        const { cowInventory } = fn.hugCow(
          {
            cowInventory: [cow],
          },
          cow.id
        )

        expect(cowInventory[0].happiness).toBe(1)
      })
    })
  })

  describe('cow has hit daily hug benefit limit', () => {
    test('does not increase cow happiness', () => {
      const cow = generateCow({ happiness: 0.5, happinessBoostsToday: 3 })
      const {
        cowInventory: [{ happiness, happinessBoostsToday }],
      } = fn.hugCow(
        {
          cowInventory: [cow],
        },
        cow.id
      )

      expect(happiness).toBe(0.5)
      expect(happinessBoostsToday).toBe(3)
    })
  })
})

describe('offerCow', () => {
  test('makes specified cow available for trade', () => {
    const cowId = 'abc123'
    const { cowIdOfferedForTrade } = fn.offerCow({}, cowId)

    expect(cowIdOfferedForTrade).toEqual(cowId)
  })
})

describe('withdrawCow', () => {
  test('makes specified cow unavailable for trade', () => {
    const cowId = 'abc123'

    let { cowIdOfferedForTrade } = fn.withdrawCow(
      { cowIdOfferedForTrade: cowId },
      'some-other-cow'
    )

    expect(cowIdOfferedForTrade).toEqual(cowId)

    cowIdOfferedForTrade = fn.withdrawCow(
      { cowIdOfferedForTrade: cowId },
      cowId
    ).cowIdOfferedForTrade

    expect(cowIdOfferedForTrade).toEqual('')
  })
})

describe('changeCowName', () => {
  test('updates cow name', () => {
    const cow = generateCow()
    const { cowInventory } = fn.changeCowName(
      {
        cowInventory: [generateCow(), cow],
      },
      cow.id,
      'new name'
    )

    expect(cowInventory[1]).toEqual({
      ...cow,
      name: 'new name',
    })
  })

  test('restricts name length', () => {
    const cow = generateCow()
    const { cowInventory } = fn.changeCowName(
      {
        cowInventory: [cow],
      },
      cow.id,
      new Array(100).join('.')
    )

    expect(cowInventory[0].name).toHaveLength(MAX_ANIMAL_NAME_LENGTH)
  })
})

describe('updateAchievements', () => {
  let updateAchievements

  beforeAll(() => {
    jest.resetModules()
    jest.mock('../../data/achievements', () => [
      {
        id: 'test-achievement',
        name: 'Test Achievement',
        description: '',
        rewardDescription: '',
        condition: state => !state.conditionSatisfied,
        reward: state => ({ ...state, conditionSatisfied: true }),
      },
    ])

    updateAchievements = jest.requireActual('./').updateAchievements
  })

  describe('achievement was not previously met', () => {
    describe('condition is not met', () => {
      test('does not update state', () => {
        const inputState = {
          completedAchievements: {},
          conditionSatisfied: true,
          todaysNotifications: [],
        }

        const state = updateAchievements(inputState)

        expect(state).toBe(inputState)
      })
    })

    describe('condition is met', () => {
      test('updates state', () => {
        const inputState = {
          completedAchievements: {},
          conditionSatisfied: false,
          todaysNotifications: [],
        }

        const state = updateAchievements(inputState)

        expect(state).toMatchObject({
          completedAchievements: { 'test-achievement': true },
          conditionSatisfied: true,
          todaysNotifications: [
            {
              message: ACHIEVEMENT_COMPLETED`${{
                name: 'Test Achievement',
                rewardDescription: '',
              }}`,
              severity: 'success',
            },
          ],
        })
      })
    })
  })

  describe('achievement was previously met', () => {
    describe('condition is not met', () => {
      test('does not update state', () => {
        const inputState = {
          completedAchievements: { 'test-achievement': true },
          conditionSatisfied: true,
          todaysNotifications: [],
        }

        const state = updateAchievements(inputState)

        expect(state).toBe(inputState)
      })
    })

    describe('condition is met', () => {
      test('does not update state', () => {
        const inputState = {
          completedAchievements: { 'test-achievement': true },
          conditionSatisfied: false,
          todaysNotifications: [],
        }

        const state = updateAchievements(inputState)

        expect(state).toBe(inputState)
      })
    })
  })
})

describe('adjustLoan', () => {
  test('updates state', () => {
    expect(
      fn.adjustLoan(
        { money: 100, loanBalance: 50, todaysNotifications: [] },
        -25
      )
    ).toEqual({
      money: 75,
      loanBalance: 25,
      todaysNotifications: [],
    })
  })

  describe('loan payoff', () => {
    test('shows appropriate notification', () => {
      const { loansTakenOut, todaysNotifications } = fn.adjustLoan(
        {
          money: 100,
          loanBalance: 50,
          loansTakenOut: 1,
          todaysNotifications: [],
        },
        -50
      )

      expect(todaysNotifications).toEqual([
        { message: LOAN_PAYOFF``, severity: 'success' },
      ])

      expect(loansTakenOut).toEqual(1)
    })
  })

  describe('loan increase', () => {
    test('shows appropriate notification, updates state', () => {
      const { loansTakenOut, todaysNotifications } = fn.adjustLoan(
        {
          money: 100,
          loanBalance: 50,
          todaysNotifications: [],
          loansTakenOut: 1,
        },
        50
      )

      expect(todaysNotifications).toEqual([
        { message: LOAN_INCREASED`${100}`, severity: 'info' },
      ])

      expect(loansTakenOut).toEqual(2)
    })
  })
})

describe('forRange', () => {
  test('calls given reducer on range of plots', () => {
    const { field } = fn.forRange(
      {
        field: [
          [
            testCrop({ itemId: 'sample-crop-1' }),
            testCrop({ itemId: 'sample-crop-1' }),
          ],
          [testCrop({ itemId: 'sample-crop-1' })],
          [],
          [],
          [testCrop({ itemId: 'sample-crop-1' })],
        ],
      },
      fn.waterPlot,
      1,
      1,
      1
    )

    expect(field[0][0].wasWateredToday).toBe(true)
    expect(field[0][1].wasWateredToday).toBe(true)
    expect(field[1][0].wasWateredToday).toBe(true)
    expect(field[4][0].wasWateredToday).toBe(false)
  })
})

describe('updatePeer', () => {
  test('updates peer data', () => {
    const { latestPeerMessages, peers } = fn.updatePeer(
      {
        latestPeerMessages: [],
        peers: { abc123: { foo: true } },
      },
      'abc123',
      { foo: false }
    )

    expect(latestPeerMessages).toEqual([])
    expect(peers).toEqual({ abc123: { foo: false } })
  })

  test('limits pendingPeerMessages', () => {
    const { latestPeerMessages } = fn.updatePeer(
      {
        latestPeerMessages: new Array(50).fill('message'),
        peers: { abc123: { foo: true } },
      },
      'abc123',
      { foo: false }
    )

    expect(latestPeerMessages).toHaveLength(MAX_LATEST_PEER_MESSAGES)
  })
})

describe('prependPendingPeerMessage', () => {
  test('prepends a message', () => {
    const { pendingPeerMessages } = fn.prependPendingPeerMessage(
      { id: 'abc123', pendingPeerMessages: [] },
      'hello world'
    )

    expect(pendingPeerMessages).toEqual([
      { id: 'abc123', message: 'hello world', severity: 'info' },
    ])
  })

  test('limits the amount of stored messages', () => {
    const { pendingPeerMessages } = fn.prependPendingPeerMessage(
      {
        id: 'abc123',
        pendingPeerMessages: new Array(50).fill({
          id: 'abc123',
          message: 'some other message',
          severity: 'info',
        }),
      },
      'hello world'
    )

    expect(pendingPeerMessages[0]).toEqual({
      id: 'abc123',
      message: 'hello world',
      severity: 'info',
    })

    expect(pendingPeerMessages).toHaveLength(MAX_PENDING_PEER_MESSAGES)
  })
})
