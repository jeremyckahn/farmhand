/** @typedef {import('../components/Farmhand/Farmhand.js').default} Farmhand */
import { cowTradeRejectionReason } from '../enums.js'
import { EXPERIENCE_VALUES } from '../constants.js'
import { COW_TRADED_NOTIFICATION } from '../templates.js'
import {
  PROGRESS_SAVED_MESSAGE,
  REQUESTED_COW_TRADE_UNAVAILABLE,
  UNKNOWN_COW_TRADE_FAILURE,
} from '../strings.js'
import { sleep } from '../utils/index.js'

import {
  addCowToInventory,
  changeCowAutomaticHugState,
  removeCowFromInventory,
  showNotification,
} from '../game-logic/reducers/index.js'

import { addExperience } from '../game-logic/reducers/addExperience.js'


export const handlePeerMetadataRequest = (farmhand: import('../components/Farmhand/Farmhand.js').default, peerMetadata: any, peerId: string) => {
  farmhand.updatePeer(farmhand, peerMetadata, peerId)
}

/**
 * Handles another player's initiation of a cow trade request.


 * @param cowTradeRequestPayload.cowOffered
 * @param cowTradeRequestPayload.cowRequested

 */
export const handleCowTradeRequest = async (
  farmhand: Farmhand,
  { cowOffered, cowRequested },
  peerId: string
) => {
  let wasTradeSuccessful = false

  farmhand.setState(
    state => {
      const {
        allowCustomPeerCowNames,
        cowIdOfferedForTrade,
        cowsTraded,
        cowInventory,
        playerId,
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
          cowOffered.originalOwnerId === playerId
            ? cowOffered.timesTraded
            : cowOffered.timesTraded + 1,
      }

      const [, peerMetadata] =
        Object.entries(peers as Record<string, { playerId?: string }>).find(
          ([, peer]) => peer?.playerId === updatedCowOffered.ownerId
        ) ?? []

      if (!peerMetadata) {
        console.error(`No data for peer ${updatedCowOffered.ownerId}`)
        return null
      }

      state = changeCowAutomaticHugState(state, cowToTradeAway, false)
      state = removeCowFromInventory(state, cowToTradeAway)
      state = addCowToInventory(state, {
        ...updatedCowOffered,
        ownerId: playerId,
      })
      state = showNotification(
        state,
        COW_TRADED_NOTIFICATION(
          '',
          cowToTradeAway,
          cowOffered,
          playerId,
          allowCustomPeerCowNames
        ),
        'success'
      )

      sendCowAccept({ ...cowToTradeAway, isUsingHuggingMachine: false }, peerId)

      wasTradeSuccessful = true

      return {
        ...state,
        cowIdOfferedForTrade: updatedCowOffered.id,
        cowsTraded:
          updatedCowOffered.originalOwnerId === playerId
            ? cowsTraded
            : cowsTraded + 1,
        isAwaitingCowTradeRequest: true,
        selectedCowId: updatedCowOffered.id,
        peers: {
          ...peers,
          [peerId]: {
            ...peerMetadata,
            cowOfferedForTrade: {
              ...cowToTradeAway,
              ownerId: (peerMetadata as { playerId?: string }).playerId,
            },
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


export const handleCowTradeRequestAccept = (farmhand: Farmhand, cowReceived: any, peerId: string) => {
  let wasTradeSuccessful = false

  farmhand.setState(
    state => {
      const {
        allowCustomPeerCowNames,
        cowIdOfferedForTrade,
        cowInventory,
        cowsTraded,
        cowTradeTimeoutId,
        playerId,
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

      const peerEntry = Object.entries(peers).find(([, peer]) => {
        const { playerId: peerPlayerId } = peer as { playerId?: string }
        return peerPlayerId === cowReceived.ownerId
      })
      const [, peerMetadata] = peerEntry || []

      const didOriginallyOwnReceivedCow =
        cowReceived.originalOwnerId === playerId

      const updatedCowReceived = {
        ...cowReceived,
        timesTraded: didOriginallyOwnReceivedCow
          ? cowReceived.timesTraded
          : cowReceived.timesTraded + 1,
      }

      state = removeCowFromInventory(state, cowTradedAway)
      state = addCowToInventory(state, {
        ...updatedCowReceived,
        ownerId: playerId,
      })
      state = showNotification(
        state,
        COW_TRADED_NOTIFICATION(
          '',
          cowTradedAway,
          updatedCowReceived,
          playerId,
          allowCustomPeerCowNames
        ),
        'success'
      )

      if (!didOriginallyOwnReceivedCow) {
        state = addExperience(state, EXPERIENCE_VALUES.COW_TRADED)
      }

      clearTimeout(cowTradeTimeoutId)

      wasTradeSuccessful = true

      return {
        ...state,
        cowsTraded:
          updatedCowReceived.originalOwnerId === playerId
            ? cowsTraded
            : cowsTraded + 1,
        cowTradeTimeoutId: null,
        isAwaitingCowTradeRequest: false,
        cowIdOfferedForTrade: updatedCowReceived.id,
        selectedCowId: updatedCowReceived.id,
        peers: {
          ...peers,
          [peerId]: {
            ...(peerMetadata as object),
            cowOfferedForTrade: {
              ...cowTradedAway,
              ownerId: (peerMetadata as { playerId?: string }).playerId,
            },
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


 * @param cowTradeRejectionPayload.reason
 */
export const handleCowTradeRequestReject = (farmhand: Farmhand, { reason }) => {
  const { cowTradeTimeoutId } = farmhand.state

  if (typeof cowTradeTimeoutId === 'number') {
    clearTimeout(cowTradeTimeoutId)
  }

  farmhand.setState({
    cowTradeTimeoutId: null,
    isAwaitingCowTradeRequest: false,
  })

  farmhand.showNotification(REQUESTED_COW_TRADE_UNAVAILABLE, 'error')
}
