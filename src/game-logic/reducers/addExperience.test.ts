import { experienceNeededForLevel } from '../../utils/experienceNeededForLevel.js'
import { testState } from '../../test-utils/testState.js'

import { addExperience } from './addExperience.js'

describe('addExperience', () => {
  let gameState: farmhand.state

  beforeEach(() => {
    gameState = testState({
      experience: 0,
      inventory: [],
      showNotifications: true,
      todaysNotifications: [],
    })
  })

  it('adds experience to current experience', () => {
    const newState = addExperience(gameState, 10)

    expect(newState.experience).toEqual(10)
  })

  it('process a level up when enough experience is achieved', () => {
    const newState = addExperience(gameState, experienceNeededForLevel(2))

    expect(newState.todaysNotifications[0].message).toEqual(
      expect.stringContaining('You reached **level 2!**')
    )
  })
})
