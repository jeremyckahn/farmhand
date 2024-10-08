import seedrandom from 'seedrandom'
import globalWindow from 'global/window.js'

export class RandomNumberService {
  /**
   * @type {Function?}
   */
  seededRandom = null

  constructor() {
    // The availability of window.location needs to be checked before accessing
    // its .search property. This code runs in both a browser and Node.js
    // context, and window.location is not defined in Node.js environments.
    const initialSeed = new URLSearchParams(globalWindow.location?.search).get(
      'seed'
    )

    if (initialSeed) {
      this.seedRandomNumber(initialSeed)
    }
  }

  /**
   * @param {string} seed
   */
  seedRandomNumber(seed) {
    this.seededRandom = seedrandom(seed)
  }

  /**
   * @returns {number}
   */
  generateRandomNumber() {
    return this.seededRandom ? this.seededRandom() : Math.random()
  }

  unseedRandomNumber() {
    this.seededRandom = null
  }

  /**
   * Compares given number against a randomly generated number.
   * @param {number} chance Float between 0-1 to compare dice roll against.
   * @returns {boolean} True if the dice roll was equal to or lower than the
   * given chance, false otherwise.
   */
  isRandomNumberLessThan(chance) {
    return this.generateRandomNumber() <= chance
  }
}

export const randomNumberService = new RandomNumberService()
