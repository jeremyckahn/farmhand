import { computeStateForNextDay } from '../../game-logic/reducers'

export const saveFileStubFactory = overrides =>
  computeStateForNextDay(
    { dayCount: 0, valueAdjustments: {}, ...overrides },
    true
  )
