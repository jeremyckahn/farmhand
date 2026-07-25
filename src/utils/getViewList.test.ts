import { stageFocusType } from '../enums.js'

import { getViewList } from './getViewList.js'

const { CELLAR, COW_PEN, FIELD, HOME, SHOP, WORKSHOP, FOREST } = stageFocusType

describe('getViewList', () => {
  test('returns the standard views plus Home and Workshop by default', () => {
    expect(
      getViewList({
        isForestUnlocked: false,
        purchasedCellar: 0,
        purchasedCowPen: 0,
        showHomeScreen: true,
      })
    ).toEqual([HOME, SHOP, FIELD, WORKSHOP])
  })

  test('omits Home when showHomeScreen is false', () => {
    expect(
      getViewList({
        isForestUnlocked: false,
        purchasedCellar: 0,
        purchasedCowPen: 0,
        showHomeScreen: false,
      })
    ).toEqual([SHOP, FIELD, WORKSHOP])
  })

  test('includes Forest only when isForestUnlocked is true', () => {
    expect(
      getViewList({
        isForestUnlocked: true,
        purchasedCellar: 0,
        purchasedCowPen: 0,
        showHomeScreen: true,
      })
    ).toEqual([HOME, SHOP, FIELD, FOREST, WORKSHOP])
  })

  test('includes Cow Pen only when purchasedCowPen is truthy', () => {
    expect(
      getViewList({
        isForestUnlocked: false,
        purchasedCellar: 0,
        purchasedCowPen: 1,
        showHomeScreen: true,
      })
    ).toEqual([HOME, SHOP, FIELD, COW_PEN, WORKSHOP])
  })

  test('includes Cellar only when purchasedCellar is truthy', () => {
    expect(
      getViewList({
        isForestUnlocked: false,
        purchasedCellar: 1,
        purchasedCowPen: 0,
        showHomeScreen: true,
      })
    ).toEqual([HOME, SHOP, FIELD, WORKSHOP, CELLAR])
  })

  test('includes every optional view in the correct order when all are unlocked', () => {
    expect(
      getViewList({
        isForestUnlocked: true,
        purchasedCellar: 1,
        purchasedCowPen: 1,
        showHomeScreen: true,
      })
    ).toEqual([HOME, SHOP, FIELD, FOREST, COW_PEN, WORKSHOP, CELLAR])
  })
})
