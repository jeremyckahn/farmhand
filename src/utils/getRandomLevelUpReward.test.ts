import { vitest } from 'vitest'

import { carrotSeed } from '../data/items.js'

import { getRandomLevelUpReward } from './getRandomLevelUpReward.js'

describe('getRandomLevelUpReward', () => {
  test('returns a crop item', async () => {
    vitest.spyOn(Math, 'random').mockReturnValue(0)

    expect(getRandomLevelUpReward(2)).toEqual(carrotSeed)
  })
})
