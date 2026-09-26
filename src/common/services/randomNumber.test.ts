import { RandomNumberService, randomNumberService } from './randomNumber.js'

const chance = 0.6

describe('RandomNumberService', () => {
  describe('generateRandomNumber', () => {
    let service: RandomNumberService

    beforeEach(() => {
      service = new RandomNumberService()
    })

    test('returns queued numbers for a stream before random ones', () => {
      service.seedRandomNumber('123')
      const firstSeeded = service.generateRandomNumber('a')

      service.seedRandomNumber('123')
      service.queueRandomNumbers('a', [0.1, 0.2])

      expect(service.generateRandomNumber('a')).toEqual(0.1)
      expect(service.generateRandomNumber('a')).toEqual(0.2)
      expect(service.generateRandomNumber('a')).toEqual(firstSeeded)
    })

    test('queued numbers only affect their own stream', () => {
      vitest.spyOn(Math, 'random').mockReturnValue(0.42)
      service.queueRandomNumbers('a', [0.1])

      expect(service.generateRandomNumber('b')).toEqual(0.42)
      expect(service.generateRandomNumber()).toEqual(0.42)
      expect(service.generateRandomNumber('a')).toEqual(0.1)
    })

    test('unqueued stream draws come from the shared seeded sequence', () => {
      service.seedRandomNumber('123')
      const shared = [
        service.generateRandomNumber(),
        service.generateRandomNumber(),
      ]

      service.seedRandomNumber('123')

      expect([
        service.generateRandomNumber('a'),
        service.generateRandomNumber('b'),
      ]).toEqual(shared)
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
