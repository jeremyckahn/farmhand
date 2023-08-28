import { addExperience } from './addExperience'

describe('addExperience', () => {
  it('adds experience to current experience', () => {
    const gameState = { experience: 0, itemsSold: {} }

    const newState = addExperience(gameState, 100)

    expect(newState.experience).toEqual(100)
  })
})
