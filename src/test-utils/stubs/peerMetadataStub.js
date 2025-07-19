import { v4 as uuid } from 'uuid'

export const getPeerMetadataStub = () => {
  /** @type farmhand.peerMetadata */
  const peerMetadata = {
    cowsSold: {},
    cropsHarvested: {},
    dayCount: 0,
    experience: 0,
    id: uuid(),
    money: 0,
    pendingPeerMessages: [],
    version: '0.0.0',
  }

  return peerMetadata
}
