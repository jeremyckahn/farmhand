export class RandomNumberService {
  random = Math.random

  seedRandomNumber() {}

  /**
   * @returns {number}
   */
  generateRandomNumber() {
    return Math.random()
  }

  unseedRandomNumber() {}
}

export const randomNumberService = new RandomNumberService()
