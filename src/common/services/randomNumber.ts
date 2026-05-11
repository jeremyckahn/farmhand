import seedrandom from 'seedrandom'
import globalWindow from 'global/window.js'

export class RandomNumberService {
  seededRandom: (() => number) | null = null

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

  seedRandomNumber(seed: string) {
    this.seededRandom = seedrandom(seed)
  }

  generateRandomNumber(): number {
    return this.seededRandom ? this.seededRandom() : Math.random()
  }

  unseedRandomNumber() {
    this.seededRandom = null
  }

  /**
   * Compares given number against a randomly generated number.
   * @param chance Float between 0-1 to compare dice roll against.
   * @returns True if the dice roll was equal to or lower than the
given chance, false otherwise.
   */
  isRandomNumberLessThan(chance: number): boolean {
    return this.generateRandomNumber() <= chance
  }
}

export const randomNumberService = new RandomNumberService()
