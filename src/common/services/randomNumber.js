import seedrandom from 'seedrandom'
import window from 'global/window'

export class RandomNumberService {
  random = Math.random

  constructor() {
    const initialSeed = new URLSearchParams(window.location.search).get('seed')

    if (initialSeed) {
      this.seedRandomNumber(initialSeed)
    }
  }

  /**
   * @param {string} seed
   */
  seedRandomNumber(seed) {
    this.random = seedrandom(seed)
  }

  /**
   * @returns {number}
   */
  generateRandomNumber() {
    return this.random()
  }

  unseedRandomNumber() {
    this.random = Math.random
  }
}

export const randomNumberService = new RandomNumberService()
