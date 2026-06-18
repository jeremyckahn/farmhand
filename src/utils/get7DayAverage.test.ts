import { get7DayAverage } from './get7DayAverage.js'

describe('get7DayAverage', () => {
  test('calculates 7 day revenue average', () => {
    expect(get7DayAverage([])).toBe(0)
    expect(get7DayAverage([-1, -1, -1, -1, -1, -1, -1])).toBe(-1)
    expect(get7DayAverage([1, 1, 1, 1, 1, 1, 1])).toBe(1)
    expect(get7DayAverage([1, 2, 3, 4, 5, 6, 7])).toBe(4)
  })
})
