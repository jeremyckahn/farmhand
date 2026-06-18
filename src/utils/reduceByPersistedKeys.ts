import { PERSISTED_STATE_KEYS } from '../constants.js'

export const reduceByPersistedKeys = (
  state: Partial<farmhand.state>
): farmhand.state =>
  PERSISTED_STATE_KEYS.reduce((acc: any, key) => {
    // This check prevents old exports from corrupting game state when
    // imported.
    if (typeof state[key as keyof farmhand.state] !== 'undefined') {
      acc[key] = state[key as keyof farmhand.state]
    }

    return acc
  }, {}) as farmhand.state
