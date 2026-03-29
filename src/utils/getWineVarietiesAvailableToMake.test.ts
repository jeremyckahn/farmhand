import {
  carrot,
  grapeChardonnay,
  grapeTempranillo,
} from '../data/crops/index.js'
import { grapeVariety } from '../enums.js'

import { getWineVarietiesAvailableToMake } from './getWineVarietiesAvailableToMake.js'

describe('getWineVarietiesAvailableToMake', () => {
  test.each([
    [{}, []],
    [
      {
        [grapeTempranillo.id]: 1,
        [carrot.id]: 1,
        [grapeChardonnay.id]: 10,
      },
      [grapeVariety.TEMPRANILLO, grapeVariety.CHARDONNAY],
    ],
  ])('calculates wine varieties available', (itemsSold, expected) => {
    const result = getWineVarietiesAvailableToMake(itemsSold)

    expect(result).toEqual(expected)
  })
})
