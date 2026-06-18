import { random } from '../common/utils.js'

export function randomChoice<T extends { weight: number }>(
  weightedOptions: T[]
): T {
  let totalWeight = 0
  const sortedOptions: T[] = []

  for (const option of weightedOptions) {
    totalWeight += option.weight
    sortedOptions.push(option)
  }

  sortedOptions.sort((a, b) => a.weight - b.weight)

  let diceRoll = random() * totalWeight
  let option: T | undefined
  let runningTotal = 0

  for (const i in sortedOptions) {
    option = sortedOptions[i]

    if (diceRoll < option.weight + runningTotal) {
      return option
    }

    runningTotal += option.weight
  }

  // Fallback to the last option if no match found
  return sortedOptions[sortedOptions.length - 1]
}
