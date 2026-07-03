import { useCallback } from 'react'

import * as reducers from '../../../game-logic/reducers/index.js'
import { endpoints } from '../../../config.js'
import { stageFocusType } from '../../../enums.js'
import { postData } from '../../../fetch-utils.js'
import {
  DATA_DELETED,
  PROGRESS_SAVED_MESSAGE,
  SERVER_ERROR,
} from '../../../strings.js'
import { POSITIONS_POSTED_NOTIFICATION } from '../../../templates.js'
import { computeMarketPositions } from '../../../utils/computeMarketPositions.js'
import { reduceByPersistedKeys } from '../../../utils/reduceByPersistedKeys.js'
import { sleep } from '../../../utils/sleep.js'
import { FarmhandProps } from '../FarmhandReducers.js'
import { FarmhandService } from '../FarmhandService.js'

export function useFarmhandDayAdvancement(
  state: farmhand.state,
  setState: React.Dispatch<React.SetStateAction<farmhand.state>>,
  props: FarmhandProps,
  boundReducersRef: React.MutableRefObject<any>
) {
  const clearPersistedData = useCallback(async () => {
    await props.localforage?.clear()
    boundReducersRef.current.showNotification(DATA_DELETED)
  }, [props.localforage, boundReducersRef])

  const persistState = useCallback(
    (currentState: farmhand.state, overrides = {}) => {
      return props.localforage?.setItem(
        'state',
        reduceByPersistedKeys({ ...currentState, ...overrides })
      )
    },
    [props.localforage]
  )

  const updateServerForNextDay = useCallback(async () => {
    const serverMessages: farmhand.notification[] = []
    let broadcastedPositionMessage: string | null = null

    setState(s => ({ ...s, isAwaitingNetworkRequest: true }))

    let serverValueAdjustments: Record<string, number> | undefined

    if (state.isOnline) {
      const {
        inventory,
        room,
        todaysPurchases,
        todaysStartingInventory,
      } = state
      const positions = computeMarketPositions(
        todaysStartingInventory,
        todaysPurchases,
        inventory
      )

      try {
        serverValueAdjustments = (
          await postData(endpoints.postDayResults, { positions, room })
        ).valueAdjustments
        if (Object.keys(positions).length) {
          serverMessages.push({
            message: POSITIONS_POSTED_NOTIFICATION('', 'You', positions),
            severity: 'info',
          })
          broadcastedPositionMessage = POSITIONS_POSTED_NOTIFICATION(
            '',
            '',
            positions
          )
        }
      } catch (e) {
        serverMessages.push({ message: SERVER_ERROR, severity: 'error' })
        setState(s => ({
          ...s,
          redirect: '/',
          cowIdOfferedForTrade: '',
          isAwaitingNetworkRequest: false,
        }))
        console.error(e)
      }
    }
    return {
      broadcastedPositionMessage,
      serverMessages,
      serverValueAdjustments,
    }
  }, [state, setState])

  const incrementDay = useCallback(
    async (isFirstDay = false) => {
      let shouldBlock = false

      setState(prev => {
        if (prev.isWaitingForDayToCompleteIncrementing && !isFirstDay) {
          shouldBlock = true
        }
        return prev
      })

      if (shouldBlock) return

      if (!isFirstDay) {
        setState(prev => ({
          ...prev,
          isWaitingForDayToCompleteIncrementing: true,
        }))
      }

      // Wait until network operations are done.
      const {
        broadcastedPositionMessage,
        serverMessages,
        serverValueAdjustments,
      } = await updateServerForNextDay()

      // Using functional updater to ensure we always compute based on the absolute latest state
      let resolvedNextDayState: any = null
      let pendingNotifications: any = []

      setState(prev => {
        const nextDayState = reducers.computeStateForNextDay(prev, isFirstDay)

        pendingNotifications = [
          ...serverMessages,
          ...nextDayState.newDayNotifications,
        ]
        nextDayState.valueAdjustments = FarmhandService.applyPriceEvents(
          serverValueAdjustments ?? nextDayState.valueAdjustments,
          nextDayState.priceCrashes,
          nextDayState.priceSurges
        )
        nextDayState.isAwaitingNetworkRequest = false
        nextDayState.isWaitingForDayToCompleteIncrementing = false // UNLOCK UI IMMEDIATELY
        nextDayState.newDayNotifications = []
        nextDayState.todaysNotifications = []

        resolvedNextDayState = nextDayState
        return nextDayState
      })

      // We defer the async stuff until the state update is queued
      setTimeout(async () => {
        try {
          if (resolvedNextDayState) {
            console.log('INCREMENT DAY SUCCESS', resolvedNextDayState.day)
            await props.localforage?.setItem(
              'state',
              reduceByPersistedKeys({
                ...resolvedNextDayState,
                newDayNotifications: pendingNotifications,
              })
            )

            const notifications = [...pendingNotifications]

            notifications
              .concat(
                isFirstDay
                  ? []
                  : [{ message: PROGRESS_SAVED_MESSAGE, severity: 'info' }]
              )
              .forEach(({ message, severity }) =>
                boundReducersRef.current.showNotification(message, severity)
              )

            if (resolvedNextDayState.isCombineEnabled) {
              if (resolvedNextDayState.stageFocus === stageFocusType.FIELD) {
                await sleep(1000)
              }
              boundReducersRef.current.forRange(
                reducers.harvestPlot,
                Infinity,
                0,
                0
              )
            }
          }
        } catch (e) {
          console.error(e)
          boundReducersRef.current.showNotification(JSON.stringify(e), 'error')
        } finally {
          if (broadcastedPositionMessage) {
            boundReducersRef.current.prependPendingPeerMessage(
              broadcastedPositionMessage
            )
          }
        }
      }, 0)
    },
    [updateServerForNextDay, props.localforage, setState, boundReducersRef]
  )

  const initializeNewGame = useCallback(async () => {
    // Stub
  }, [])

  return {
    clearPersistedData,
    persistState,
    updateServerForNextDay,
    incrementDay,
    initializeNewGame,
  }
}
