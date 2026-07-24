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

  test('handles fractional daysWatered correctly (fertilized crops)', () => {
    // pumpkin cropTimeline: [3, 1, 1, 1, 1, 1]
    const crop = { itemId: 'pumpkin', daysWatered: 7.5 }
    expect(getGrowingPhase(crop as any)).toEqual(5)
  })
})
