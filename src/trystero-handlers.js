import { cowTradeRejectionReason } from './enums'
import { COW_TRADED_NOTIFICATION } from './templates'
import {
  PROGRESS_SAVED_MESSAGE,
  REQUESTED_COW_TRADE_UNAVAILABLE,
  UNKNOWN_COW_TRADE_FAILURE,
} from './strings'

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
 */
export const handleCowTradeRequest = async (
  farmhand,
  { cowOffered, cowRequested }
) => {
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
  } = farmhand.state

  if (!sendCowAccept || !sendCowReject)
    throw new Error('Peer connection not set up correctly')

  const cowToTradeAway = cowInventory.find(
    ({ id }) => id === cowIdOfferedForTrade
  )

  if (
    isAwaitingCowTradeRequest ||
    cowRequested.id !== cowIdOfferedForTrade ||
    !cowToTradeAway
  ) {
    sendCowReject({
      reason: cowTradeRejectionReason.REQUESTED_COW_UNAVAILABLE,
    })

    return
  }

  const updatedCowOffered = {
    ...cowOffered,
    timesTraded:
      cowOffered.originalOwnerId === id
        ? cowOffered.timesTraded
        : cowOffered.timesTraded + 1,
  }

  const [peerId, peerMetadata] = Object.entries(peers).find(
    ([peerId, { id }]) => id === updatedCowOffered.ownerId
  )

  farmhand.changeCowAutomaticHugState(cowToTradeAway, false)
  farmhand.removeCowFromInventory(cowToTradeAway)
  farmhand.addCowToInventory({
    ...updatedCowOffered,
    ownerId: id,
  })
  farmhand.setState(() => ({
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
  }))

  sendCowAccept({ ...cowToTradeAway, isUsingHuggingMachine: false })

  farmhand.showNotification(
    COW_TRADED_NOTIFICATION`${cowToTradeAway}${cowOffered}${id}${allowCustomPeerCowNames}`,
    'success'
  )
}

/**
 * @param {Farmhand} farmhand
 * @param {farmhand.cow} cowReceived
 */
export const handleCowTradeRequestAccept = (farmhand, cowReceived) => {
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

  const [peerId, peerMetadata] = Object.entries(peers).find(
    ([peerId, { id }]) => id === cowReceived.ownerId
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
    }
  )

  farmhand.showNotification(
    COW_TRADED_NOTIFICATION`${cowTradedAway}${updatedCowReceived}${id}${allowCustomPeerCowNames}`,
    'success'
  )

  farmhand.showNotification(PROGRESS_SAVED_MESSAGE, 'info')
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
