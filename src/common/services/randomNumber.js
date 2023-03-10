import seedrandom from 'seedrandom'
import window from 'global/window'

export class RandomNumberService {
  random = Math.random

  constructor() {
    // The availability of window.location needs to be checked before accessing
    // its .search property. This code runs in both a browser and Node.js
    // context, and window.location is not defined in Node.js environments.
    const initialSeed = new URLSearchParams(window.location?.search).get('seed')

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
