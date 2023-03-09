import seedrandom from 'seedrandom'

export class RandomNumberService {
  random = Math.random()

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
}

export const randomNumberService = new RandomNumberService()
