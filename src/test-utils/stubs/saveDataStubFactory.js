import { computeStateForNextDay } from '../../game-logic/reducers'

export const saveDataStubFactory = ({ dayCount = 1, ...restOverrides }) =>
  computeStateForNextDay(
    // dayCount is offset by 1 here to account for the fact that
    // computeStateForNextDay's isFirstDay argument below is true.
    {
      dayCount: dayCount - 1,
      valueAdjustments: {},
      field: [[]],
      ...restOverrides,
    },

    // Necessary for the stubbed state to be valid.
    true
  )
