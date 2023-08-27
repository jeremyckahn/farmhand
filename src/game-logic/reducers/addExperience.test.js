import { addExperience } from './addExperience'
import { processLevelUp } from './processLevelUp'

jest.mock('./processLevelUp')

describe('addExperience', () => {
  const gameState = { experience: 0, itemsSold: {} }

  it('adds experience to current experience', () => {
    const newState = addExperience(gameState, 100)

    expect(newState.experience).toEqual(100)
  })

  it('will check for leveling up when experience is added', () => {
    addExperience(gameState, 100)

    expect(processLevelUp).toHaveBeenCalled()
  })
})
