/** @typedef {import('../components/Farmhand/Farmhand').default} Farmhand */
/** @typedef {import('../index').farmhand.peerMetadata} farmhand.peerMetadata */
import { cowTradeRejectionReason } from '../enums'
import { EXPERIENCE_VALUES, COW_TRADED_NOTIFICATION } from '../templates'
import {
  PROGRESS_SAVED_MESSAGE,
  REQUESTED_COW_TRADE_UNAVAILABLE,
  UNKNOWN_COW_TRADE_FAILURE,
} from '../strings'
import { sleep } from '../utils'

import {
  addCowToInventory,
  changeCowAutomaticHugState,
  removeCowFromInventory,
  showNotification,
} from '../game-logic/reducers'

import { addExperience } from '../game-logic/reducers/addExperience'

/**
 * @param {Farmhand} farmhand
 * @param {farmhand.peerMetadata} peerMetadata
 * @param {string} peerId
 */
export const handlePeerMetadataRequest = (farmhand, peerMetadata, peerId) => {
  farmhand.updatePeer(farmhand, peerMetadata, peerId)
}

/**
 * Handles another player's initiation of a cow trade request.
 * @param {Farmhand} farmhand
 * @param {Object} cowTradeRequestPayload
 * @param {farmhand.cow} cowTradeRequestPayload.cowOffered
 * @param {farmhand.cow} cowTradeRequestPayload.cowRequested
 * @param {string} peerId
 */
export const handleCowTradeRequest = async (
  farmhand,
  { cowOffered, cowRequested },
  peerId
) => {
  let wasTradeSuccessful = false

  farmhand.setState(
    state => {
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

      const [, peerMetadata] =
        Object.entries(peers).find(
          ([, peer]) => peer?.id === updatedCowOffered.ownerId
        ) ?? []

      if (!peerMetadata) {
        console.error(`No data for peer ${updatedCowOffered.ownerId}`)
        return null
      }

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

      wasTradeSuccessful = true

      return {
        ...state,
        cowIdOfferedForTrade: updatedCowOffered.id,
        cowsTraded:
          updatedCowOffered.originalOwnerId === id
            ? cowsTraded
            : cowsTraded + 1,
        isAwaitingCowTradeRequest: true,
        selectedCowId: updatedCowOffered.id,
        peers: {
          ...peers,
          [peerId]: {
            ...peerMetadata,
            cowOfferedForTrade: { ...cowToTradeAway, ownerId: peerMetadata.id },
          },
        },
      }
    },
    async () => {
      if (!wasTradeSuccessful) return

      // Allow any pending state updates to complete so that an invalid state
      // is not persisted
      await sleep(750)

      await farmhand.persistState()

      farmhand.showNotification(PROGRESS_SAVED_MESSAGE, 'info')
      farmhand.setState(() => ({
        isAwaitingCowTradeRequest: false,
      }))
    }
  )
}

/**
 * @param {Farmhand} farmhand
 * @param {farmhand.cow} cowReceived
 * @param {string} peerId
 */
export const handleCowTradeRequestAccept = (farmhand, cowReceived, peerId) => {
  let wasTradeSuccessful = false

  farmhand.setState(
    state => {
      const {
        allowCustomPeerCowNames,
        cowIdOfferedForTrade,
        cowInventory,
        cowsTraded,
        cowTradeTimeoutId,
        id,
        peers,
      } = state

      const cowTradedAway = cowInventory.find(
        ({ id }) => id === cowIdOfferedForTrade
      )

      if (!cowTradedAway) {
        console.error(
          `handleCowTradeRequestAccept: cow with ID ${cowIdOfferedForTrade} is no longer available`
        )

        state = showNotification(state, UNKNOWN_COW_TRADE_FAILURE, 'error')

        return {
          ...state,
          isAwaitingCowTradeRequest: false,
        }
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

      state = removeCowFromInventory(state, cowTradedAway)
      state = addCowToInventory(state, {
        ...updatedCowReceived,
        ownerId: id,
      })
      state = showNotification(
        state,
        COW_TRADED_NOTIFICATION`${cowTradedAway}${updatedCowReceived}${id}${allowCustomPeerCowNames}`,
        'success'
      )
      state = addExperience(state, EXPERIENCE_VALUES.COW_TRADED)

      clearTimeout(cowTradeTimeoutId)

      wasTradeSuccessful = true

      return {
        ...state,
        cowsTraded:
          updatedCowReceived.originalOwnerId === id
            ? cowsTraded
            : cowsTraded + 1,
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
      }
    },
    async () => {
      if (!wasTradeSuccessful) return

      await farmhand.persistState()

      farmhand.showNotification(PROGRESS_SAVED_MESSAGE, 'info')
    }
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
