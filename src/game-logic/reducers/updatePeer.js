/**
 * @typedef {import('../../components/Farmhand/Farmhand').farmhand.state} farmhand.state
 * @typedef {import('../../index').farmhand.peerMetadata} farmhand.peerMetadata
 */
import { MAX_LATEST_PEER_MESSAGES } from '../../constants'
import { NEW_COW_OFFERED_FOR_TRADE } from '../../templates'

import { showNotification } from './showNotification'

/**
 * @param {farmhand.state} state
 * @param {string} peerId The peer to update
 * @param {farmhand.peerMetadata} peerMetadata
 * @returns {farmhand.state}
 */
export const updatePeer = (state, peerId, peerMetadata) => {
  const peers = { ...state.peers }

  const previousPeerMetadata = peers[peerId]

  const previousCowOfferedId = previousPeerMetadata?.cowOfferedForTrade?.id
  const newCowOfferedId = peerMetadata.cowOfferedForTrade?.id

  const isCowNewlyBeingOfferedForTrade =
    newCowOfferedId &&
    previousCowOfferedId !== peerMetadata.cowOfferedForTrade?.id

  peers[peerId] = peerMetadata

  // Out of date peer clients may not provide pendingPeerMessages, so default
  // it here.
  const { pendingPeerMessages = [] } = peerMetadata

  if (isCowNewlyBeingOfferedForTrade) {
    state = showNotification(state, NEW_COW_OFFERED_FOR_TRADE`${peerMetadata}`)
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
