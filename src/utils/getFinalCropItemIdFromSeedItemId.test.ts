import { vitest } from 'vitest'

import { getFinalCropItemIdFromSeedItemId } from './getFinalCropItemIdFromSeedItemId.js'

describe('getFinalCropItemIdFromSeedItemId', () => {
  test('gets "final" crop item id from seed item id', () => {
    expect(getFinalCropItemIdFromSeedItemId('carrot-seed')).toEqual('carrot')
  })

  test('gets "final" crop item id from seed item id with varieties', () => {
    vitest.spyOn(Math, 'random').mockReturnValue(0)
    expect(getFinalCropItemIdFromSeedItemId('grape-seed')).toEqual(
      'grape-chardonnay'
    )
  })
})
