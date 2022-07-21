import isRandomNumberLessThan from '../../utils/isRandomNumberLessThan'

import { spawnWeeds } from './spawnWeeds'

jest.mock('../../utils/isRandomNumberLessThan')

describe('spawnWeeds', () => {
  it('will not spawn weeds in an occupied plot', () => {
    const plotContents = 'occupied'

    expect(spawnWeeds(plotContents)).toEqual(plotContents)
  })

  it('will spawn weeds if the plot is empty and the random chance event succeeds', () => {
    isRandomNumberLessThan.mockReturnValue(true)

    expect(spawnWeeds(null)).toEqual({
      itemId: 'weed',
      fertilizerType: 'NONE',
    })
  })

  it('will not spawn weeds if the random chance fails', () => {
    isRandomNumberLessThan.mockReturnValue(false)

    expect(spawnWeeds(null)).toEqual(null)
  })
})
