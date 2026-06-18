import { percentageString } from './percentageString.js'

const percentageStringTests = [
  [0.5, '50%'],
  [0.05, '5%'],
  [1, '100%'],
  [10, '1000%'],
  [-0.3, '-30%'],
]

describe.each(percentageStringTests)(
  'percentageString',
  (percent, expectedString) => {
    test(`it converts ${percent} to a ${expectedString}`, () => {
      expect(percentageString(Number(percent))).toEqual(expectedString)
    })
  }
)
