import seedrandom from 'seedrandom'
import globalWindow from 'global/window.js'

export class RandomNumberService {
  seededRandom: (() => number) | null = null

  /**
   * Values queued per stream name that are returned, in order, before any
   * seeded or Math.random value. This lets tests force a specific outcome
   * (e.g. rain tonight) without searching for a seed that happens to produce
   * it. Exposed via the window.farmhand debug hook.
   */
  queuedNumbers: Map<string, number[]> = new Map()

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

  /**
   * @param stream Optional name of the random number stream being drawn
   * from, which lets queueRandomNumbers target it. Values that aren't queued
   * come from the same seeded (or Math.random) sequence regardless of stream.
   */
  generateRandomNumber(stream?: string): number {
    if (stream !== undefined) {
      const queuedNumber = this.queuedNumbers.get(stream)?.shift()

      if (queuedNumber !== undefined) {
        return queuedNumber
      }
    }

    return this.seededRandom ? this.seededRandom() : Math.random()
  }

  /**
   * @param stream Name of the random number stream to queue values for.
   * @param numbers Values to return from the stream, in order, before it
   * resumes producing random numbers.
   */
  queueRandomNumbers(stream: string, numbers: number[]) {
    this.queuedNumbers.set(stream, [
      ...(this.queuedNumbers.get(stream) ?? []),
      ...numbers,
    ])
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
