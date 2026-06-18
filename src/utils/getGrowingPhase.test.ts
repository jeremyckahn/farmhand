import { getGrowingPhase } from './getGrowingPhase.js'

describe('getGrowingPhase', () => {
  test.each([
    [0, 0],
    [0, 1],
    [1, 2],
    [2, 3],
  ])('it returns phase %s when days watered is %s', (phase, daysWatered) => {
    const crop = { itemId: 'potato', daysWatered }

    expect(getGrowingPhase(crop as any)).toEqual(phase)
  })
})
