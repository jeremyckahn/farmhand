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

  test.each([
    [0, 2.5],
    [4, 6.5],
    [5, 7.5],
    [6, 8.5],
  ])(
    'it handles fractional daysWatered correctly (returns phase %s when days watered is %s for pumpkin)',
    (phase, daysWatered) => {
      // pumpkin cropTimeline: [3, 1, 1, 1, 1, 1]
      const crop = { itemId: 'pumpkin', daysWatered }

      expect(getGrowingPhase(crop as any)).toEqual(phase)
    }
  )
})
