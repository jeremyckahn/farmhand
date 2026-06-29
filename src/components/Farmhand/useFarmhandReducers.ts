import { useMemo } from 'react'

import * as reducers from '../../game-logic/reducers/index.js'

import { FarmhandReducers } from './FarmhandReducers.js'

export function useFarmhandReducers(
  state: any,
  setState: (updater: any) => void
) {
  return useMemo(() => {
    const boundReducers: Record<string, Function> = {}

    Object.assign(boundReducers, reducers) // Ensure all pure reducers are accessible as fallbacks

    for (const key of Object.getOwnPropertyNames(
      FarmhandReducers.prototype
    ).filter(k => k !== 'constructor') as Array<
      keyof typeof FarmhandReducers
    >) {
      const reducer = (reducers as any)[key] as Function

      if (typeof reducer !== 'function') continue

      // Bound version triggers setState
      boundReducers[key as string] = (...args: any[]) => {
        setState((prevState: any) => {
          const nextState = reducer(prevState, ...args)

          if (!nextState || nextState === prevState) {
            return prevState
          }
          return { ...nextState }
        })
      }
    }

    return boundReducers
  }, [setState])
}
