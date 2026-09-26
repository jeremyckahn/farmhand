import { randomStream } from '../../enums.js'

import { RandomNumberService, randomNumberService } from './randomNumber.js'

const chance = 0.6

describe('RandomNumberService', () => {
  describe('generateRandomNumber', () => {
    let service: RandomNumberService

    beforeEach(() => {
      service = new RandomNumberService()
    })

    test('returns queued numbers for a stream before random ones', () => {
      const reference = new RandomNumberService()

      reference.seedRandomNumber('123')
      const firstSeeded = reference.generateRandomNumber()

      service.seedRandomNumber('123')
      service.queueRandomNumbers(randomStream.WEATHER, [0.1, 0.2])

      expect(service.generateRandomNumber(randomStream.WEATHER)).toEqual(0.1)
      expect(service.generateRandomNumber(randomStream.WEATHER)).toEqual(0.2)
      // Queued numbers don't consume seeded draws, so the seeded sequence
      // resumes from its start
      expect(service.generateRandomNumber(randomStream.WEATHER)).toEqual(
        firstSeeded
      )
    })

    test('queued numbers only affect their own stream', () => {
      vitest.spyOn(Math, 'random').mockReturnValue(0.42)
      service.queueRandomNumbers(randomStream.WEATHER, [0.1])

      expect(service.generateRandomNumber(randomStream.PRICE_EVENTS)).toEqual(
        0.42
      )
      expect(service.generateRandomNumber()).toEqual(0.42)
      expect(service.generateRandomNumber(randomStream.WEATHER)).toEqual(0.1)
    })

    test('unqueued stream draws come from the shared seeded sequence', () => {
      const reference = new RandomNumberService()

      reference.seedRandomNumber('123')
      const shared = [
        reference.generateRandomNumber(),
        reference.generateRandomNumber(),
      ]

      service.seedRandomNumber('123')

      expect([
        service.generateRandomNumber(randomStream.WEATHER),
        service.generateRandomNumber(randomStream.PRICE_EVENTS),
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
