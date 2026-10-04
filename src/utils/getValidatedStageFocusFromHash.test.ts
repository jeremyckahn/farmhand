import { stageFocusType } from '../enums.js'

import { getValidatedStageFocusFromHash } from './getValidatedStageFocusFromHash.js'

const { FARMHAND_SHUFFLE, FIELD, FOREST, HOME } = stageFocusType

const defaultState = {
  experience: 0,
  purchasedCellar: 0,
  purchasedCowPen: 0,
  showHomeScreen: true,
}

describe('getValidatedStageFocusFromHash', () => {
  test('returns undefined when the hash has no view param', () => {
    window.history.replaceState({}, '', `${window.location.pathname}`)

    expect(getValidatedStageFocusFromHash(defaultState)).toBeUndefined()
  })

  test('returns the view when it is unlocked for the given state', () => {
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}#?view=FIELD`
    )

    expect(getValidatedStageFocusFromHash(defaultState)).toEqual(FIELD)
  })

  test('returns undefined when the view is not unlocked for the given state', () => {
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}#?view=FOREST`
    )

    expect(getValidatedStageFocusFromHash(defaultState)).toBeUndefined()
  })

  test('returns the view once its unlock requirement is met', () => {
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}#?view=FOREST`
    )

    expect(
      getValidatedStageFocusFromHash({ ...defaultState, experience: 20_000 })
    ).toEqual(FOREST)
  })

  test('returns undefined when the hash names a view outside stageFocusType entirely', () => {
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}#?view=NOT_A_REAL_VIEW`
    )

    expect(getValidatedStageFocusFromHash(defaultState)).toBeUndefined()
  })

  test('returns undefined when Farmhand Shuffle is not unlocked for the given state', () => {
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}#?view=FARMHAND_SHUFFLE`
    )

    expect(getValidatedStageFocusFromHash(defaultState)).toBeUndefined()
  })

  test('returns FARMHAND_SHUFFLE once its unlock requirement (level 35) is met', () => {
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}#?view=FARMHAND_SHUFFLE`
    )

    expect(
      getValidatedStageFocusFromHash({ ...defaultState, experience: 120_000 })
    ).toEqual(FARMHAND_SHUFFLE)
  })

  test('returns HOME when showHomeScreen is true, matching the default view list', () => {
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}#?view=HOME`
    )

    expect(getValidatedStageFocusFromHash(defaultState)).toEqual(HOME)
  })
})
