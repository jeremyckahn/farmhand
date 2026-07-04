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

export interface NextDayStateRecord {
  state: farmhand.state
  pendingNotifications: farmhand.notification[]
  broadcastedPositionMessage: string | null
  isFirstDay: boolean
}

export const useFarmhandDayAdvancement = (
  state: farmhand.state,
  setState: React.Dispatch<React.SetStateAction<farmhand.state>>,
  props: FarmhandProps,
  boundReducersRef: React.MutableRefObject<any>,
  nextDayStateRef: React.MutableRefObject<NextDayStateRecord | null>
) => {
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

    setState(previous => ({ ...previous, isAwaitingNetworkRequest: true }))

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

        setState(previous => ({
          ...previous,
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

      setState(previous => {
        if (previous.isWaitingForDayToCompleteIncrementing && !isFirstDay) {
          shouldBlock = true
        }

        return previous
      })

      if (shouldBlock) return

      if (!isFirstDay) {
        setState(previous => ({
          ...previous,
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
      setState(previous => {
        const nextDayState = reducers.computeStateForNextDay(
          previous,
          isFirstDay
        )

        const pendingNotifications = [
          ...serverMessages,
          ...nextDayState.newDayNotifications,
        ]

        nextDayState.valueAdjustments = FarmhandService.applyPriceEvents(
          serverValueAdjustments ?? nextDayState.valueAdjustments,
          nextDayState.priceCrashes,
          nextDayState.priceSurges
        )

        nextDayState.isAwaitingNetworkRequest = false
        nextDayState.isWaitingForDayToCompleteIncrementing = true
        nextDayState.newDayNotifications = []
        nextDayState.todaysNotifications = []

        nextDayStateRef.current = {
          state: nextDayState,
          pendingNotifications,
          broadcastedPositionMessage,
          isFirstDay,
        }

        return nextDayState
      })
    },
    [updateServerForNextDay, setState, nextDayStateRef]
  )

  return {
    clearPersistedData,
    persistState,
    updateServerForNextDay,
    incrementDay,
  }
}
