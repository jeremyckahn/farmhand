import { cowTradeRejectionReason } from './enums'
import { COW_TRADED_NOTIFICATION } from './templates'
import {
  PROGRESS_SAVED_MESSAGE,
  REQUESTED_COW_TRADE_UNAVAILABLE,
  UNKNOWN_COW_TRADE_FAILURE,
} from './strings'
import {
  addCowToInventory,
  changeCowAutomaticHugState,
  removeCowFromInventory,
  showNotification,
} from './reducers'

/**
 * @param {Farmhand} farmhand
 * @param {Object} peerState
 * @param {string} peerId
 */
export const handlePeerMetadataRequest = (farmhand, peerState, peerId) => {
  farmhand.updatePeer(peerId, peerState)
}

/**
 * Handles another player's initiation of a cow trade request.
 * @param {Farmhand} farmhand
 * @param {Object} cowTradeRequestPayload
 * @param {farmhand.cow} cowTradeRequestPayload.cowOffered
 * @param {farmhand.cow} cowTradeRequestPayload.cowRequested
 * @param {string} peerId
 */
export const handleCowTradeRequest = (
  farmhand,
  { cowOffered, cowRequested },
  peerId
) => {
  farmhand.setState(state => {
    const {
      allowCustomPeerCowNames,
      cowIdOfferedForTrade,
      cowsTraded,
      cowInventory,
      id,
      isAwaitingCowTradeRequest,
      peers,
      sendCowAccept,
      sendCowReject,
    } = state

    if (!sendCowAccept || !sendCowReject) {
      console.error('Peer connection not set up correctly')
      return null
    }

    const cowToTradeAway = cowInventory.find(
      ({ id }) => id === cowIdOfferedForTrade
    )

    if (
      isAwaitingCowTradeRequest ||
      cowRequested.id !== cowIdOfferedForTrade ||
      !cowToTradeAway
    ) {
      sendCowReject(
        {
          reason: cowTradeRejectionReason.REQUESTED_COW_UNAVAILABLE,
        },
        peerId
      )

      return null
    }

    const updatedCowOffered = {
      ...cowOffered,
      timesTraded:
        cowOffered.originalOwnerId === id
          ? cowOffered.timesTraded
          : cowOffered.timesTraded + 1,
    }

    const [, peerMetadata] = Object.entries(peers).find(
      ([, { id }]) => id === updatedCowOffered.ownerId
    )

    state = changeCowAutomaticHugState(state, cowToTradeAway, false)
    state = removeCowFromInventory(state, cowToTradeAway)
    state = addCowToInventory(state, {
      ...updatedCowOffered,
      ownerId: id,
    })
    state = showNotification(
      state,
      COW_TRADED_NOTIFICATION`${cowToTradeAway}${cowOffered}${id}${allowCustomPeerCowNames}`,
      'success'
    )

    sendCowAccept({ ...cowToTradeAway, isUsingHuggingMachine: false }, peerId)

    return {
      ...state,
      cowIdOfferedForTrade: updatedCowOffered.id,
      cowsTraded:
        updatedCowOffered.originalOwnerId === id ? cowsTraded : cowsTraded + 1,
      selectedCowId: updatedCowOffered.id,
      peers: {
        ...peers,
        [peerId]: {
          ...peerMetadata,
          cowOfferedForTrade: { ...cowToTradeAway, ownerId: peerMetadata.id },
        },
      },
    }
  })
}

/**
 * @param {Farmhand} farmhand
 * @param {farmhand.cow} cowReceived
 * @param {string} peerId
 */
export const handleCowTradeRequestAccept = (farmhand, cowReceived, peerId) => {
  const {
    allowCustomPeerCowNames,
    cowIdOfferedForTrade,
    cowInventory,
    cowsTraded,
    cowTradeTimeoutId,
    id,
    peers,
  } = farmhand.state

  const cowTradedAway = cowInventory.find(
    ({ id }) => id === cowIdOfferedForTrade
  )

  if (!cowTradedAway) {
    console.error(
      `handleCowTradeRequestAccept: cow with ID ${cowIdOfferedForTrade} is no longer available`
    )

    farmhand.showNotification(UNKNOWN_COW_TRADE_FAILURE, 'error')
    farmhand.setState(() => ({
      isAwaitingCowTradeRequest: false,
    }))

    return
  }

  const [, peerMetadata] = Object.entries(peers).find(
    ([, { id }]) => id === cowReceived.ownerId
  )

  const updatedCowReceived = {
    ...cowReceived,
    timesTraded:
      cowReceived.originalOwnerId === id
        ? cowReceived.timesTraded
        : cowReceived.timesTraded + 1,
  }

  farmhand.removeCowFromInventory(cowTradedAway)
  farmhand.addCowToInventory({
    ...updatedCowReceived,
    ownerId: id,
  })

  clearTimeout(cowTradeTimeoutId)

  farmhand.setState(
    () => ({
      cowsTraded:
        updatedCowReceived.originalOwnerId === id ? cowsTraded : cowsTraded + 1,
      cowTradeTimeoutId: null,
      isAwaitingCowTradeRequest: false,
      cowIdOfferedForTrade: updatedCowReceived.id,
      selectedCowId: updatedCowReceived.id,
      peers: {
        ...peers,
        [peerId]: {
          ...peerMetadata,
          cowOfferedForTrade: { ...cowTradedAway, ownerId: peerMetadata.id },
        },
      },
    }),
    async () => {
      await farmhand.persistState()

      farmhand.showNotification(PROGRESS_SAVED_MESSAGE, 'info')
    }
  )

  farmhand.showNotification(
    COW_TRADED_NOTIFICATION`${cowTradedAway}${updatedCowReceived}${id}${allowCustomPeerCowNames}`,
    'success'
  )
}

/**
 * @param {Farmhand} farmhand
 * @param {Object} cowTradeRejectionPayload
 * @param {string} cowTradeRejectionPayload.reason
 */
export const handleCowTradeRequestReject = (farmhand, { reason }) => {
  const { cowTradeTimeoutId } = farmhand.state

  clearTimeout(cowTradeTimeoutId)

  farmhand.setState({
    cowTradeTimeoutId: null,
    isAwaitingCowTradeRequest: false,
  })

  farmhand.showNotification(REQUESTED_COW_TRADE_UNAVAILABLE, 'error')
}
