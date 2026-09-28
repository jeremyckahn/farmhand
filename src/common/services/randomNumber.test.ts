import { randomNumberService } from './randomNumber.js'

const chance = 0.6

describe('RandomNumberService', () => {
  describe('isRandomNumberLessThan', () => {
    test('it returns true when random number is below chance', () => {
      vitest
        .spyOn(randomNumberService, 'generateRandomNumber')
        .mockReturnValueOnce(chance - 0.01)

      expect(randomNumberService.isRandomNumberLessThan(chance)).toEqual(true)
    })

    test('it returns true when random number is same as chance', () => {
      vitest
        .spyOn(randomNumberService, 'generateRandomNumber')
        .mockReturnValueOnce(chance)

      expect(randomNumberService.isRandomNumberLessThan(chance)).toEqual(true)
    })

    test('it returns false when random number is above chance', () => {
      vitest
        .spyOn(randomNumberService, 'generateRandomNumber')
        .mockReturnValueOnce(chance + 0.01)

      expect(randomNumberService.isRandomNumberLessThan(chance)).toEqual(false)
    })
  })

  describe('isKeyedRandomNumberLessThan', () => {
    test('it always returns the same result for the same key', () => {
      const firstResult = randomNumberService.isKeyedRandomNumberLessThan(
        0.5,
        'some-key'
      )

      for (let i = 0; i < 20; i++) {
        expect(
          randomNumberService.isKeyedRandomNumberLessThan(0.5, 'some-key')
        ).toEqual(firstResult)
      }
    })

    test('it returns different results for different keys', () => {
      const results = new Set(
        Array.from({ length: 50 }, (_, i) =>
          randomNumberService.isKeyedRandomNumberLessThan(0.5, `key-${i}`)
        )
      )

      expect(results).toEqual(new Set([true, false]))
    })

    test('it always returns true when chance is 1', () => {
      expect(
        randomNumberService.isKeyedRandomNumberLessThan(1, 'some-key')
      ).toEqual(true)
    })

    test('it always returns false when chance is 0', () => {
      expect(
        randomNumberService.isKeyedRandomNumberLessThan(0, 'some-key')
      ).toEqual(false)
    })
  })
})
