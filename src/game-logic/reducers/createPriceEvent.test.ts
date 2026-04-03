import { testState } from '../../test-utils/index.js'

import { createPriceEvent } from './createPriceEvent.js'

vitest.mock('../../data/items.js')

describe('createPriceEvent', () => {
  test('creates priceCrashes data', () => {
    const priceEvent = {
      itemId: 'sample-crop-1',
      daysRemaining: 1,
    }

    const { priceCrashes } = createPriceEvent(
      testState({ priceCrashes: {} }),
      priceEvent,
      'priceCrashes'
    )

    expect(priceCrashes).toMatchObject({
      'sample-crop-1': priceEvent,
    })
  })

  test('creates priceSurges data', () => {
    const priceEvent = {
      itemId: 'sample-crop-1',
      daysRemaining: 1,
    }

    const { priceSurges } = createPriceEvent(
      testState({ priceSurges: {} }),
      priceEvent,
      'priceSurges'
    )

    expect(priceSurges).toMatchObject({
      'sample-crop-1': priceEvent,
    })
  })
})
