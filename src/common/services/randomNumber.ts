import seedrandom from 'seedrandom'
import globalWindow from 'global/window.js'

export class RandomNumberService {
  seed: string | null = null

  seededRandom: (() => number) | null = null

  /**
   * Independent seeded RNGs keyed by stream name. Each is derived from the
   * base seed, so draws made from one stream never shift the sequence of
   * another. This keeps seeded outcomes (e.g. weather or a given item's
   * price) stable when unrelated game data such as the item list changes.
   */
  seededStreams: Map<string, () => number> = new Map()

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
    this.seed = seed
    this.seededRandom = seedrandom(seed)
    this.seededStreams.clear()
  }

  /**
   * @param stream Optional name of an independent random number stream. When
   * the service is seeded, each named stream has its own sequence derived
   * from the seed. When unseeded, the stream name has no effect.
   */
  generateRandomNumber(stream?: string): number {
    if (this.seed === null || this.seededRandom === null) {
      return Math.random()
    }

    if (stream === undefined) {
      return this.seededRandom()
    }

    const existingStreamRandom = this.seededStreams.get(stream)

    if (existingStreamRandom) {
      return existingStreamRandom()
    }

    const streamRandom = seedrandom(`${this.seed}:${stream}`)

    this.seededStreams.set(stream, streamRandom)

    return streamRandom()
  }

  unseedRandomNumber() {
    this.seed = null
    this.seededRandom = null
    this.seededStreams.clear()
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
