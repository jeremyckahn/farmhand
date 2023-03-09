export class RandomNumberService {
  generateRandomNumber() {
    return Math.random()
  }
}

export const randomNumberService = new RandomNumberService()
