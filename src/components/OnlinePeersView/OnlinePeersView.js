import React from 'react'
import ReactMarkdown from 'react-markdown'
import Divider from '@material-ui/core/Divider'
import Alert from '@material-ui/lab/Alert'
import sortBy from 'lodash.sortby'
import { array, number, object, string } from 'prop-types'

import BailOutErrorBoundary from '../BailOutErrorBoundary'

import { getPlayerName, farmProductsSold, levelAchieved } from '../../utils'
import FarmhandContext from '../../Farmhand.context'

import OnlinePeer from './OnlinePeer'

import './OnlinePeersView.sass'

const OnlinePeersView = ({ activePlayers, id, latestPeerMessages, peers }) => {
  const peerKeys = Object.keys(peers)

  // Filter out peers that may have connected but not sent data yet.
  const populatedPeers = peerKeys.filter(peerId => peers[peerId])

  return (
    <div {...{ className: 'OnlinePeersView' }}>
      <p>
        Your player name: <strong>{getPlayerName(id)}</strong>
      </p>
      {activePlayers - 1 > populatedPeers.length && <p>Waiting for peers...</p>}
      <ul className="card-list">
        {sortBy(populatedPeers, [
          peerId =>
            // Use negative value to reverse sort order
            -levelAchieved(farmProductsSold(peers[peerId].itemsSold || 0)),
        ]).map(peerId => (
          <BailOutErrorBoundary {...{ key: peerId }}>
            <OnlinePeer {...{ peer: peers[peerId] }} />
          </BailOutErrorBoundary>
        ))}
      </ul>
      <Divider />
      <ul>
        {latestPeerMessages.map(({ id, message, severity = 'info' }, i) => (
          <li {...{ key: i }}>
            <Alert {...{ elevation: 3, severity }}>
              <ReactMarkdown
                {...{ source: `**${getPlayerName(id)}** ${message}` }}
              />
            </Alert>
          </li>
        ))}
      </ul>
    </div>
  )
}

OnlinePeersView.propTypes = {
  activePlayers: number.isRequired,
  id: string.isRequired,
  latestPeerMessages: array.isRequired,
  peers: object.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <OnlinePeersView {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
