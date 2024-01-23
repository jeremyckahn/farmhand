import { getLevelEntitlements } from './getLevelEntitlements'

describe('getLevelEntitlements', () => {
  test('calculates level entitlements', () => {
    const entitlements = getLevelEntitlements(8)

    expect(entitlements).toEqual({
      items: {
        'carrot-seed': true,
        fertilizer: true,
        'pumpkin-seed': true,
        'spinach-seed': true,
        sprinkler: true,
      },
      sprinklerRange: 2,
      stageFocusType: {},
      tools: {
        SHOVEL: true,
      },
    })
  })
})
