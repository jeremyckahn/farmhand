import { vitest } from 'vitest'

import { getRandomUnlockedCrop } from './getRandomUnlockedCrop.js'

describe('getRandomUnlockedCrop', () => {
  test('gets a random unlocked crop', () => {
    vitest.spyOn(Math, 'random').mockReturnValue(1)
    const crop = getRandomUnlockedCrop(['carrot-seed', 'pumpkin-seed'])

    expect(crop.id).toEqual('pumpkin')
  })

  test('gets a random unlocked crop with varieties', () => {
    vitest.spyOn(Math, 'random').mockReturnValue(0)
    const crop = getRandomUnlockedCrop(['grape-seed'])

    expect(crop.id).toEqual('grape-chardonnay')
  })
})
