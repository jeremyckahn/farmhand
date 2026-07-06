import { useMemo } from 'react'

import * as reducers from '../../game-logic/reducers/index.js'

import { FarmhandReducers } from './FarmhandReducers.js'

export const useFarmhandReducers = (setState: (updater: any) => void) => {
  return useMemo(() => {
    const boundReducers: Record<string, Function> = {}

    Object.assign(boundReducers, reducers) // Ensure all pure reducers are accessible as fallbacks

    const reducerNames = Object.getOwnPropertyNames(
      FarmhandReducers.prototype
    ).filter(k => k !== 'constructor') as Array<keyof typeof FarmhandReducers>

    for (const reducerName of reducerNames) {
      const reducer = (reducers as any)[reducerName] as Function

      if (typeof reducer !== 'function') continue

      // Bound version triggers setState
      boundReducers[reducerName as string] = (...args: any[]) => {
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
