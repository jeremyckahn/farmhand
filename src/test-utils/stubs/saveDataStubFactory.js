import { computeStateForNextDay } from '../../game-logic/reducers/index.js'
import { testState } from '../index.js'

/**
 * @param {Partial<farmhand.state>} state
 */
export const saveDataStubFactory = ({ dayCount = 1, ...restOverrides }) =>
  computeStateForNextDay(
    // dayCount is offset by 1 here to account for the fact that
    // computeStateForNextDay's isFirstDay argument below is true.
    testState({
      dayCount: dayCount - 1,
      valueAdjustments: {},
      field: [[]],
      ...restOverrides,
    }),

    // Necessary for the stubbed state to be valid.
    true
  )
