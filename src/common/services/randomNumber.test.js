import { randomNumberService } from './randomNumber'

describe('RandomNumberService', () => {
  describe('isRandomNumberLessThan', () => {
    const chance = 0.6

    beforeEach(() => {
      jest.spyOn(randomNumberService, 'generateRandomNumber')
    })

    test('it returns true when random number is below chance', () => {
      randomNumberService.generateRandomNumber.mockReturnValue(chance - 0.01)

      expect(randomNumberService.isRandomNumberLessThan(chance)).toEqual(true)
    })

    test('it returns true when random number is same as chance', () => {
      randomNumberService.generateRandomNumber.mockReturnValue(chance)

      expect(randomNumberService.isRandomNumberLessThan(chance)).toEqual(true)
    })

    test('it returns false when random number is above chance', () => {
      randomNumberService.generateRandomNumber.mockReturnValue(chance + 0.01)

      expect(randomNumberService.isRandomNumberLessThan(chance)).toEqual(false)
    })
  })
})
