import { ACHIEVEMENT_COMPLETED } from '../../templates'

describe('updateAchievements', () => {
  let updateAchievements

  beforeAll(() => {
    jest.resetModules()
    jest.mock('../../data/achievements', () => [
      {
        playerId: 'test-achievement',
        name: 'Test Achievement',
        description: '',
        rewardDescription: '',
        condition: state => !state.conditionSatisfied,
        reward: state => ({ ...state, conditionSatisfied: true }),
      },
    ])

    updateAchievements = jest.requireActual('./updateAchievements')
      .updateAchievements
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
