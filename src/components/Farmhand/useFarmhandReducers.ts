import { useMemo } from 'react'

import * as reducers from '../../game-logic/reducers/index.js'

import { FarmhandReducers } from './FarmhandReducers.js'

/**
 * Reducers that don't invalidate a pending field undo. forRangeWithUndo sets
 * the snapshot itself, and the rest are bookkeeping that fires alongside or
 * independently of field actions (e.g. inventory-full notifications, online
 * peer updates). Every other reducer clears the snapshot. undoFieldAction
 * also re-checks the snapshot against live state before restoring it.
 */
const reducersPreservingUndo = new Set<string>([
  'addPeer',
  'forRangeWithUndo',
  'prependPendingPeerMessage',
  'removePeer',
  'showNotification',
  'updatePeer',
])

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

      const preservesUndo = reducersPreservingUndo.has(reducerName as string)

      // Bound version triggers setState
      boundReducers[reducerName as string] = (...args: any[]) => {
        setState((prevState: any) => {
          const nextState = reducer(prevState, ...args)

          if (!nextState || nextState === prevState) {
            return prevState
          }

          return preservesUndo
            ? { ...nextState }
            : { ...nextState, undoSnapshot: null }
        })
      }
    }

    return boundReducers
  }, [setState])
}
