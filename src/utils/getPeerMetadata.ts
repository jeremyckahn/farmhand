import { PEER_METADATA_STATE_KEYS } from '../constants.js'

export const getPeerMetadata = (
  state: farmhand.state
): farmhand.peerMetadata => {
  const reducedState = PEER_METADATA_STATE_KEYS.reduce((acc: any, key) => {
    acc[key] = state[key as keyof farmhand.state]

    return acc
  }, {})

  Object.assign(reducedState, {
    cowOfferedForTrade: state.cowInventory.find(
      ({ id }) => id === state.cowIdOfferedForTrade
    ),
  })

  return reducedState as farmhand.peerMetadata
}
