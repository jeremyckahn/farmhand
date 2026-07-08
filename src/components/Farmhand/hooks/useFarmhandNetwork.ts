import { joinRoom } from '@trystero-p2p/torrent'
import window from 'global/window.js'
import throttle from 'lodash.throttle'
import { useCallback, useEffect } from 'react'

import { endpoints, relayUrls, rtcConfig } from '../../../config.js'
import {
  COW_TRADE_TIMEOUT,
  HEARTBEAT_INTERVAL_PERIOD,
} from '../../../constants.js'
import { getData } from '../../../fetch-utils.js'
import {
  handleCowTradeRequest,
  handleCowTradeRequestAccept,
  handleCowTradeRequestReject,
  handlePeerMetadataRequest,
} from '../../../handlers/peer-events.js'
import {
  CONNECTING_TO_SERVER,
  COW_ALREADY_OWNED,
  DISCONNECTED_FROM_SERVER,
  REQUESTED_COW_TRADE_UNAVAILABLE,
  SERVER_ERROR,
} from '../../../strings.js'
import { CONNECTED_TO_ROOM } from '../../../templates.js'
import { moneyTotal } from '../../../utils/moneyTotal.js'
import { FarmhandService } from '../FarmhandService.js'

const relayRedundancy = 4

export const useFarmhandNetwork = (
  state: farmhand.state,
  setState: React.Dispatch<React.SetStateAction<farmhand.state>>,
  boundReducersRef: React.MutableRefObject<any>,
  instanceProxyRef: React.MutableRefObject<any>,
  prevState: farmhand.state | undefined,
  newRoom: string,
  path: string,
  peerMetadata: farmhand.peerMetadata
) => {
  const {
    hasBooted: stateHasBooted,
    isOnline: stateIsOnline,
    room: stateRoom,
    redirect: stateRedirect,
    heartbeatTimeoutId: stateHeartbeatTimeoutId,
    peerRoom: statePeerRoom,
    sendPeerMetadata: sendPeerMetadataFromState,
  } = state

  const wrapSendPeerMetadata = useCallback(
    (sendPeerMetadata: Function) => {
      return throttle(
        (...args: any[]) => {
          sendPeerMetadata(...args)
          setState(previous => ({ ...previous, pendingPeerMessages: [] }))
        },
        5000,
        { trailing: true }
      )
    },
    [setState]
  )

  const handleCowTradeTimeout = useCallback(() => {
    if (
      typeof instanceProxyRef.current?.state?.cowTradeTimeoutId === 'number'
    ) {
      boundReducersRef.current.showNotification(
        REQUESTED_COW_TRADE_UNAVAILABLE,
        'error'
      )
      console.error('Cow trade request timed out')
      setState(previous => ({
        ...previous,
        cowTradeTimeoutId: null,
        isAwaitingCowTradeRequest: false,
      }))
    }
  }, [setState, boundReducersRef, instanceProxyRef])

  const tradeForPeerCow = useCallback(
    (peerPlayerCow: farmhand.cow) => {
      const latestState = instanceProxyRef.current?.state ?? state
      const {
        cowIdOfferedForTrade,
        cowInventory,
        peers,
        sendCowTradeRequest,
      } = latestState

      if (!sendCowTradeRequest) return

      const { ownerId } = peerPlayerCow
      const [peerId] =
        Object.entries(peers).find(
          ([, peer]: [string, any]) => peer?.playerId === ownerId
        ) ?? []

      if (!peerId) {
        console.error(
          `Owner not found for cow ${JSON.stringify(peerPlayerCow)}`
        )
        return
      }

      const playerAlreadyOwnsRequestedCow = cowInventory.find(
        ({ id }: farmhand.cow) => id === peerPlayerCow.id
      )

      if (playerAlreadyOwnsRequestedCow) {
        console.error(`Cow ID ${peerPlayerCow.id} is already in inventory`)
        boundReducersRef.current.showNotification(COW_ALREADY_OWNED, 'error')
        return
      }

      const cowToTradeAway = cowInventory.find(
        ({ id }: farmhand.cow) => id === cowIdOfferedForTrade
      )

      if (!cowToTradeAway) {
        console.error(`Cow ID ${cowIdOfferedForTrade} not found`)
        return
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

      setState(previous => ({
        ...previous,
        cowTradeTimeoutId: (cowTradeTimeoutId as unknown) as number,
        isAwaitingCowTradeRequest: true,
      }))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setState, handleCowTradeTimeout, boundReducersRef, instanceProxyRef]
  )

  const scheduleHeartbeat = useCallback(() => {
    setState(previous => {
      clearTimeout(previous.heartbeatTimeoutId ?? -1)
      return previous
    })

    const timeoutId = (window.setTimeout(() => {
      setState((previous: farmhand.state) => ({
        ...previous,
        money: moneyTotal(previous.money, previous.activePlayers ?? 0),
      }))
      scheduleHeartbeat()
    }, HEARTBEAT_INTERVAL_PERIOD) as unknown) as number

    setState(previous => ({ ...previous, heartbeatTimeoutId: timeoutId }))
  }, [setState])

  const syncToRoom = useCallback(async () => {
    const {
      isOnline,
      priceCrashes,
      priceSurges,
      room,
      playerId,
      peerRoom,
    } = instanceProxyRef.current.state

    if (!isOnline) return

    boundReducersRef.current.showNotification(CONNECTING_TO_SERVER, 'info')

    try {
      setState(previous => ({
        ...previous,
        isAwaitingNetworkRequest: true,
        peers: {},
      }))

      peerRoom?.leave()

      const { valueAdjustments } = await getData(endpoints.getMarketData, {
        farmId: playerId,
        room,
      })

      scheduleHeartbeat()

      setState(previous => ({
        ...previous,
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
    } catch (e) {
      boundReducersRef.current.showNotification(SERVER_ERROR, 'error')
      console.error(e)

      setState(previous => ({
        ...previous,
        redirect: '/',
        cowIdOfferedForTrade: '',
      }))
    }

    setState(previous => ({
      ...previous,
      isAwaitingNetworkRequest: false,
      isAwaitingCowTradeRequest: false,
    }))
  }, [scheduleHeartbeat, boundReducersRef, instanceProxyRef, setState])

  const messagePeers = useCallback(
    (message: string, severity?: string) => {
      boundReducersRef.current.prependPendingPeerMessage(message, severity)
    },
    [boundReducersRef]
  )

  // ComponentDidUpdate for online status and sync
  useEffect(() => {
    if (!stateHasBooted || !prevState) return

    const decodedRoom = decodeURIComponent(newRoom)
    const newIsOnline = path.startsWith('/online')

    // A redirect that was just requested (e.g. by toggling online/offline)
    // hasn't been picked up by the router yet, so `path` still reflects the
    // route we're navigating away from. Reconciling isOnline/room against
    // that stale path would immediately stomp on the change we just made.
    const redirectJustRequested =
      Boolean(stateRedirect) && stateRedirect !== prevState.redirect

    if (
      !redirectJustRequested &&
      (newIsOnline !== stateIsOnline || decodedRoom !== stateRoom)
    ) {
      setState(previous => ({
        ...previous,
        isOnline: newIsOnline,
        redirect: '',
        room: decodedRoom,
      }))
    } else if (
      stateRedirect &&
      !redirectJustRequested &&
      newIsOnline === stateIsOnline &&
      decodedRoom === stateRoom
    ) {
      // The router has caught up to the redirect we requested; clear it.
      setState(previous => ({ ...previous, redirect: '' }))
    }

    if (stateIsOnline !== prevState.isOnline || stateRoom !== prevState.room) {
      if (stateIsOnline) syncToRoom()

      if (!stateIsOnline && typeof stateHeartbeatTimeoutId === 'number') {
        clearTimeout(stateHeartbeatTimeoutId)

        setState(previous => ({
          ...previous,
          activePlayers: null,
          heartbeatTimeoutId: null,
          peerRoom: null,
        }))
      }
    }

    if (stateIsOnline === false && prevState.isOnline === true) {
      boundReducersRef.current.showNotification(
        DISCONNECTED_FROM_SERVER,
        'info'
      )
    }

    if (statePeerRoom !== prevState.peerRoom) {
      if (statePeerRoom) {
        statePeerRoom.onPeerJoin((id: string) =>
          boundReducersRef.current.addPeer(id)
        )
        statePeerRoom.onPeerLeave((id: string) =>
          boundReducersRef.current.removePeer(id)
        )

        const [
          sendPeerMetadata,
          getPeerMetadataFunc,
        ] = statePeerRoom.makeAction('peerMetadata')

        getPeerMetadataFunc((...args: any[]) =>
          handlePeerMetadataRequest(instanceProxyRef.current, args[0], args[1])
        )

        const [
          sendCowTradeRequest,
          getCowTradeRequest,
        ] = statePeerRoom.makeAction('cowTrade')

        getCowTradeRequest((...args: any[]) =>
          handleCowTradeRequest(instanceProxyRef.current, args[0], args[1])
        )

        const [sendCowAccept, getCowAccept] = statePeerRoom.makeAction(
          'cowAccept'
        )

        getCowAccept((...args: any[]) =>
          handleCowTradeRequestAccept(
            instanceProxyRef.current,
            args[0],
            args[1]
          )
        )

        const [sendCowReject, getCowReject] = statePeerRoom.makeAction(
          'cowReject'
        )

        getCowReject((...args: any[]) =>
          handleCowTradeRequestReject(instanceProxyRef.current, args[0])
        )

        setState(previous => ({
          ...previous,
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
        setState(previous => ({
          ...previous,
          peers: {},
          sendPeerMetadata: null,
        }))
      }
    }

    sendPeerMetadataFromState?.(peerMetadata)
  }, [
    stateHasBooted,
    stateIsOnline,
    stateRoom,
    stateRedirect,
    stateHeartbeatTimeoutId,
    statePeerRoom,
    sendPeerMetadataFromState,
    prevState,
    newRoom,
    path,
    syncToRoom,
    wrapSendPeerMetadata,
    peerMetadata,
    boundReducersRef,
    instanceProxyRef,
    setState,
  ])

  return {
    syncToRoom,
    scheduleHeartbeat,
    wrapSendPeerMetadata,
    tradeForPeerCow,
    handleCowTradeTimeout,
    messagePeers,
  }
}
