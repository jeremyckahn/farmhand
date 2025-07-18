/** @typedef {import('../../components/Farmhand/Farmhand.js').default} Farmhand */
import { MAX_LATEST_PEER_MESSAGES } from '../../constants.js'
import { NEW_COW_OFFERED_FOR_TRADE } from '../../templates.js'
import { dialogView } from '../../enums.js'

import { showNotification } from './showNotification.js'

/**
 * @param {farmhand.state} state
 * @param {Farmhand} farmhand
 * @param {farmhand.peerMetadata} peerMetadata
 * @param {string} peerId The peer to update
 * @returns {farmhand.state}
 */
export const updatePeer = (state, farmhand, peerMetadata, peerId) => {
  const peers = { ...state.peers }

  const previousPeerMetadata = peers[peerId]

  const previousCowOfferedId = previousPeerMetadata?.cowOfferedForTrade?.id
  const newCowOfferedId = peerMetadata.cowOfferedForTrade?.id

  const isNewTrade = newCowOfferedId && previousCowOfferedId !== newCowOfferedId

  peers[peerId] = peerMetadata

  // Out of date peer clients may not provide pendingPeerMessages, so default
  // it here.
  const { pendingPeerMessages = [] } = peerMetadata

  if (isNewTrade) {
    state = showNotification(
      state,
      NEW_COW_OFFERED_FOR_TRADE`${peerMetadata}`,
      'info',
      () => {
        farmhand.openDialogView(dialogView.ONLINE_PEERS)
      }
    )
  }

  return {
    ...state,
    peers,
    latestPeerMessages: [
      ...pendingPeerMessages,
      ...state.latestPeerMessages,
    ].slice(0, MAX_LATEST_PEER_MESSAGES),
  }
}
