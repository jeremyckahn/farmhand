import { PERSISTED_STATE_KEYS } from '../constants.js'

// Assigning through a single generic type parameter (rather than indexing
// both sides with the raw `keyof farmhand.state` union inline) is what lets
// TypeScript verify that acc[key] and state[key] agree without a cast.
const assignPersistedKey = <TKey extends keyof farmhand.state>(
  acc: Partial<farmhand.state>,
  state: Partial<farmhand.state>,
  key: TKey
): void => {
  const value = state[key]

  // This check prevents old exports from corrupting game state when
  // imported.
  if (typeof value !== 'undefined') {
    acc[key] = value
  }
}

export const reduceByPersistedKeys = (
  state: Partial<farmhand.state>
): farmhand.state =>
  (PERSISTED_STATE_KEYS as Array<keyof farmhand.state>).reduce((acc, key) => {
    assignPersistedKey(acc, state, key)

    return acc
  }, {} as Partial<farmhand.state>) as farmhand.state
