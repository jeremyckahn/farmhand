// TODO: Add tests for this reducer
/**
 * @param peerId The peer to remove
 */
export const removePeer = (
  state: farmhand.state,
  peerId: string
): farmhand.state => {
  const peers = { ...state.peers }
  delete peers[peerId]

  return { ...state, peers, activePlayers: (state.activePlayers ?? 1) - 1 }
}
