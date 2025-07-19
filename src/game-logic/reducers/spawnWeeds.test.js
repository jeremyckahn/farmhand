import { randomNumberService } from '../../common/services/randomNumber.js'
import { testCrop } from '../../test-utils/index.js'

import { spawnWeeds } from './spawnWeeds.js'

beforeEach(() => {
  vitest.spyOn(randomNumberService, 'isRandomNumberLessThan')
})

describe('spawnWeeds', () => {
  it('will not spawn weeds in an occupied plot', () => {
    const plotContents = testCrop()

    expect(spawnWeeds(plotContents)).toEqual(plotContents)
  })

  it('will spawn weeds if the plot is empty and the random chance event succeeds', () => {
    // @ts-expect-error
    randomNumberService.isRandomNumberLessThan.mockReturnValue(true)

    expect(spawnWeeds(null)).toEqual({
      itemId: 'weed',
      fertilizerType: 'NONE',
    })
  })

  it('will not spawn weeds if the random chance fails', () => {
    // @ts-expect-error
    randomNumberService.isRandomNumberLessThan.mockReturnValue(false)

    expect(spawnWeeds(null)).toEqual(null)
  })
})
