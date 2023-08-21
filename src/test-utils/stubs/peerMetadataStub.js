/** @typedef {import('../../index').farmhand.peerMetadata} farmhand.peerMetadata */

import { v4 as uuid } from 'uuid'

export const getPeerMetadataStub = () => {
  /** @type farmhand.peerMetadata */
  const peerMetadata = {
    cowsSold: {},
    cropsHarvested: 0,
    dayCount: 0,
    id: uuid(),
    itemsSold: {},
    money: 0,
    pendingPeerMessages: [],
    version: '0.0.0',
  }

  return peerMetadata
}
