import { useCallback, useEffect } from 'react'
import { joinRoom } from '@trystero-p2p/torrent'
import window from 'global/window.js'
import throttle from 'lodash.throttle'

import {
  handleCowTradeRequest,
  handleCowTradeRequestAccept,
  handleCowTradeRequestReject,
  handlePeerMetadataRequest,
} from '../../../handlers/peer-events.js'

import { endpoints, relayUrls, rtcConfig } from '../../../config.js'
import {
  COW_TRADE_TIMEOUT,
  DEFAULT_ROOM,
  HEARTBEAT_INTERVAL_PERIOD,
} from '../../../constants.js'
import { getData } from '../../../fetch-utils.js'
import {
  CONNECTING_TO_SERVER,
  COW_ALREADY_OWNED,
  DISCONNECTED_FROM_SERVER,
  REQUESTED_COW_TRADE_UNAVAILABLE,
  SERVER_ERROR,
} from '../../../strings.js'
import { CONNECTED_TO_ROOM } from '../../../templates.js'
import { moneyTotal } from '../../../utils/moneyTotal.js'
import { FarmhandProps } from '../FarmhandReducers.js'
import { FarmhandService } from '../FarmhandService.js'

export const useFarmhandNetwork = (
  state: farmhand.state,
  setState: React.Dispatch<React.SetStateAction<farmhand.state>>,
  props: FarmhandProps,
  boundReducersRef: React.MutableRefObject<any>,
  instanceProxyRef: React.MutableRefObject<any>,
  prevState: farmhand.state | undefined,
  newRoom: string,
  path: string,
  peerMetadata: any
) => {
  const wrapSendPeerMetadata = useCallback(
    (sendPeerMetadata: Function) => {
      return throttle(
        (...args: any[]) => {
          sendPeerMetadata(...args)
          setState(s => ({ ...s, pendingPeerMessages: [] }))
        },
        5000,
        { trailing: true }
      )
    },
    [setState]
  )

  const handleCowTradeTimeout = useCallback(() => {
    setState(s => {
      if (typeof s.cowTradeTimeoutId === 'number') {
        setTimeout(
          () =>
            boundReducersRef.current.showNotification(
              REQUESTED_COW_TRADE_UNAVAILABLE,
              'error'
            ),
          0
        )
        console.error('Cow trade request timed out')
        return {
          ...s,
          cowTradeTimeoutId: null,
          isAwaitingCowTradeRequest: false,
        }
      }
      return s
    })
  }, [setState, boundReducersRef])

  const tradeForPeerCow = useCallback(
    (peerPlayerCow: farmhand.cow) => {
      setState((s: farmhand.state) => {
        const {
          cowIdOfferedForTrade,
          cowInventory,
          peers,
          sendCowTradeRequest,
        } = s

        if (!sendCowTradeRequest) return s

        const { ownerId } = peerPlayerCow
        const [peerId] =
          Object.entries(peers).find(
            ([, peer]: [string, any]) => peer?.playerId === ownerId
          ) ?? []

        if (!peerId) {
          console.error(
            `Owner not found for cow ${JSON.stringify(peerPlayerCow)}`
          )
          return s
        }

        const playerAlreadyOwnsRequestedCow = cowInventory.find(
          ({ id }: farmhand.cow) => id === peerPlayerCow.id
        )

        if (playerAlreadyOwnsRequestedCow) {
          console.error(`Cow ID ${peerPlayerCow.id} is already in inventory`)
          setTimeout(
            () =>
              boundReducersRef.current.showNotification(
                COW_ALREADY_OWNED,
                'error'
              ),
            0
          )
          return s
        }

        const cowToTradeAway = cowInventory.find(
          ({ id }: farmhand.cow) => id === cowIdOfferedForTrade
        )

        if (!cowToTradeAway) {
          console.error(`Cow ID ${cowIdOfferedForTrade} not found`)
          return s
        }

        const cowTradeTimeoutId = setTimeout(
          handleCowTradeTimeout,
          COW_TRADE_TIMEOUT
        )

        sendCowTradeRequest(
          {
            cowOffered: { ...cowToTradeAway, isUsingHuggingMachine: false },
            cowRequested: peerPlayerCow,
          },
          peerId
        )

        return {
          ...s,
          cowTradeTimeoutId: (cowTradeTimeoutId as unknown) as number,
          isAwaitingCowTradeRequest: true,
        }
      })
    },
    [setState, handleCowTradeTimeout, boundReducersRef]
  )

  const scheduleHeartbeat = useCallback(() => {
    setState(s => {
      clearTimeout(s.heartbeatTimeoutId ?? -1)
      const heartbeatTimeoutId = (window.setTimeout(() => {
        setState((s2: farmhand.state) => ({
          ...s2,
          money: moneyTotal(s2.money, s2.activePlayers ?? 0),
        }))
        scheduleHeartbeat()
      }, HEARTBEAT_INTERVAL_PERIOD) as unknown) as number

      return { ...s, heartbeatTimeoutId }
    })
  }, [setState])

  const syncToRoom = useCallback(async () => {
    const { isOnline, priceCrashes, priceSurges, room } = state

    if (!isOnline) return

    boundReducersRef.current.showNotification(CONNECTING_TO_SERVER, 'info')

    try {
      setState(s => ({ ...s, isAwaitingNetworkRequest: true, peers: {} }))
      state.peerRoom?.leave()

      const { valueAdjustments } = await getData(endpoints.getMarketData, {
        farmId: state.playerId,
        room,
      })

      scheduleHeartbeat()

      const relayRedundancy = 4

      setState(s => ({
        ...s,
        activePlayers: 1,
        peerRoom: joinRoom(
          {
            appId: import.meta.env?.VITE_NAME,
            rtcConfig,
            ...(relayUrls && {
              relayConfig: { urls: relayUrls, redundancy: relayRedundancy },
            }),
          },
          room
        ),
        valueAdjustments: FarmhandService.applyPriceEvents(
          valueAdjustments,
          priceCrashes,
          priceSurges
        ),
      }))

      boundReducersRef.current.showNotification(
        CONNECTED_TO_ROOM('', room),
        'success'
      )
      console.log('SYNC TO ROOM SUCCESS')
    } catch (e) {
      boundReducersRef.current.showNotification(SERVER_ERROR, 'error')
      console.log('SYNC TO ROOM ERROR', e, 'STATE:', state)
      console.error(e)
      setState(s => ({ ...s, redirect: '/', cowIdOfferedForTrade: '' }))
    }

    setState(s => ({
      ...s,
      isAwaitingNetworkRequest: false,
      isAwaitingCowTradeRequest: false,
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isOnline, state.room, scheduleHeartbeat, boundReducersRef])

  const messagePeers = useCallback(
    (message: string, severity?: string) => {
      boundReducersRef.current.prependPendingPeerMessage(message, severity)
    },
    [boundReducersRef]
  )

  const handleOnlineToggleChange = useCallback(
    (goOnline: boolean) => {
      if (!goOnline) {
        boundReducersRef.current.showNotification(
          DISCONNECTED_FROM_SERVER,
          'info'
        )
      }

      setState((s: farmhand.state) => {
        const { room, cowIdOfferedForTrade } = s

        return goOnline
          ? {
              ...s,
              redirect: `/online/${encodeURIComponent(room)}`,
              cowIdOfferedForTrade,
              isOnline: true,
            }
          : {
              ...s,
              redirect: '/',
              cowIdOfferedForTrade: '',
              isOnline: false,
            }
      })
    },
    [setState, boundReducersRef]
  )

  const handleRoomChange = useCallback(
    (room: string) => {
      setState((s: farmhand.state) => ({
        ...s,
        room,
        redirect: `/online/${encodeURIComponent(room.trim() || DEFAULT_ROOM)}`,
      }))
    },
    [setState]
  )

  // ComponentDidUpdate for online status and sync
  useEffect(() => {
    if (!state.hasBooted || !prevState) return

    const decodedRoom = decodeURIComponent(newRoom)
    const newIsOnline = path.startsWith('/online')

    if (newIsOnline !== state.isOnline || decodedRoom !== state.room) {
      setState(s => ({
        ...s,
        isOnline: newIsOnline,
        redirect: '',
        room: decodedRoom,
      }))
    }

    if (
      state.isOnline !== prevState.isOnline ||
      state.room !== prevState.room
    ) {
      if (newIsOnline) syncToRoom()

      if (!state.isOnline && typeof state.heartbeatTimeoutId === 'number') {
        clearTimeout(state.heartbeatTimeoutId)
        setState(s => ({
          ...s,
          activePlayers: null,
          heartbeatTimeoutId: null,
          peerRoom: null,
        }))
      }
    }

    if (state.isOnline === false && prevState.isOnline === true) {
      boundReducersRef.current.showNotification(
        DISCONNECTED_FROM_SERVER,
        'info'
      )
    }

    if (state.peerRoom !== prevState.peerRoom) {
      if (state.peerRoom) {
        state.peerRoom.onPeerJoin((id: string) =>
          boundReducersRef.current.addPeer(id)
        )
        state.peerRoom.onPeerLeave((id: string) =>
          boundReducersRef.current.removePeer(id)
        )

        const [
          sendPeerMetadata,
          getPeerMetadataFunc,
        ] = state.peerRoom.makeAction('peerMetadata')

        getPeerMetadataFunc((...args: any[]) =>
          handlePeerMetadataRequest(instanceProxyRef.current, args[0], args[1])
        )

        const [
          sendCowTradeRequest,
          getCowTradeRequest,
        ] = state.peerRoom.makeAction('cowTrade')

        getCowTradeRequest((...args: any[]) =>
          handleCowTradeRequest(instanceProxyRef.current, args[0], args[1])
        )

        const [sendCowAccept, getCowAccept] = state.peerRoom.makeAction(
          'cowAccept'
        )

        getCowAccept((...args: any[]) =>
          handleCowTradeRequestAccept(
            instanceProxyRef.current,
            args[0],
            args[1]
          )
        )

        const [sendCowReject, getCowReject] = state.peerRoom.makeAction(
          'cowReject'
        )

        getCowReject((...args: any[]) =>
          handleCowTradeRequestReject(instanceProxyRef.current, args[0])
        )

        setState(s => ({
          ...s,
          getCowAccept,
          getCowReject,
          getCowTradeRequest,
          getPeerMetadata: getPeerMetadataFunc,
          pendingPeerMessages: [],
          sendCowAccept,
          sendCowReject,
          sendCowTradeRequest,
          sendPeerMetadata: wrapSendPeerMetadata(sendPeerMetadata),
        }))

        sendPeerMetadata(peerMetadata)
      } else {
        prevState.peerRoom?.leave()
        setState(s => ({ ...s, peers: {}, sendPeerMetadata: null }))
      }
    }

    state.sendPeerMetadata?.(peerMetadata)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.isOnline,
    state.room,
    state.peerRoom,
    state.hasBooted,
    state.sendPeerMetadata,
    prevState,
    newRoom,
    path,
    syncToRoom,
    wrapSendPeerMetadata,
    peerMetadata,
  ])

  return {
    syncToRoom,
    scheduleHeartbeat,
    wrapSendPeerMetadata,
    tradeForPeerCow,
    handleCowTradeTimeout,
    messagePeers,
    handleOnlineToggleChange,
    handleRoomChange,
  }
}
