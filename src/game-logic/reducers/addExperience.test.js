import { experienceNeededForLevel } from '../../utils'

import { addExperience } from './addExperience'

describe('addExperience', () => {
  let gameState

  beforeEach(() => {
    gameState = {
      experience: 0,
      inventory: [],
      showNotifications: true,
      todaysNotifications: [],
    }
  })

  it('adds experience to current experience', () => {
    const newState = addExperience(gameState, 10)

    expect(newState.experience).toEqual(10)
  })

  it('process a level up when enough experience is achieved', () => {
    const newState = addExperience(gameState, experienceNeededForLevel(2))

    const notification = /You reached \*\*level 2!\*\*/

    expect(notification.test(newState.todaysNotifications[0].message)).toEqual(
      true
    )
  })
})
