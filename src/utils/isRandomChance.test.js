import isRandomChance from './isRandomChance'

describe('isRandomChance', () => {
  const chance = 0.6

  beforeEach(() => {
    jest.spyOn(global.Math, 'random')
  })

  test('it returns true when random number is below chance', () => {
    global.Math.random.mockReturnValueOnce(chance - 0.01)
    expect(isRandomChance(chance)).toEqual(true)
  })

  test('it returns true when random number is same as chance', () => {
    global.Math.random.mockReturnValueOnce(chance)
    expect(isRandomChance(chance)).toEqual(true)
  })

  test('it returns false when random number is above chance', () => {
    global.Math.random.mockReturnValueOnce(chance + 0.01)
    expect(isRandomChance(chance)).toEqual(false)
  })
})
