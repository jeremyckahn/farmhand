import { RandomNumberService, randomNumberService } from './randomNumber.js'

const chance = 0.6

describe('RandomNumberService', () => {
  describe('generateRandomNumber', () => {
    let service: RandomNumberService

    beforeEach(() => {
      service = new RandomNumberService()
    })

    test('named streams are reproducible for a given seed', () => {
      service.seedRandomNumber('123')
      const first = [
        service.generateRandomNumber('a'),
        service.generateRandomNumber('a'),
      ]

      service.seedRandomNumber('123')
      const second = [
        service.generateRandomNumber('a'),
        service.generateRandomNumber('a'),
      ]

      expect(second).toEqual(first)
    })

    test('draws from one stream do not affect another stream', () => {
      service.seedRandomNumber('123')
      const undisturbed = service.generateRandomNumber('b')

      service.seedRandomNumber('123')
      service.generateRandomNumber()
      service.generateRandomNumber('a')
      service.generateRandomNumber('a')

      expect(service.generateRandomNumber('b')).toEqual(undisturbed)
    })

    test('different streams produce different sequences', () => {
      service.seedRandomNumber('123')

      expect(service.generateRandomNumber('a')).not.toEqual(
        service.generateRandomNumber('b')
      )
    })

    test('uses Math.random for all streams when unseeded', () => {
      vitest.spyOn(Math, 'random').mockReturnValue(0.42)

      expect(service.generateRandomNumber()).toEqual(0.42)
      expect(service.generateRandomNumber('a')).toEqual(0.42)
    })
  })

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
})
