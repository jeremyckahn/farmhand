import React from 'react'
import ReactMarkdown from 'react-markdown'
import Alert from '@mui/material/Alert/index.js'
import Divider from '@mui/material/Divider/index.js'
import Card from '@mui/material/Card/index.js'
import CardContent from '@mui/material/CardContent/index.js'
import sortBy from 'lodash.sortby'
import { array, number, object, string } from 'prop-types'

import BailOutErrorBoundary from '../BailOutErrorBoundary/index.js'

import { levelAchieved } from '../../utils/levelAchieved.js'
import { getPlayerName } from '../../utils/index.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'

import CowCard from '../CowCard/index.js'

import OnlinePeer from './OnlinePeer/index.js'

const OnlinePeersView = ({
  activePlayers,
  cowIdOfferedForTrade,
  cowInventory,
  id,
  latestPeerMessages,
  peers,
}) => {
  const peerKeys = Object.keys(peers)

  const cowOfferedForTrade = cowInventory.find(
    ({ id }) => id === cowIdOfferedForTrade
  )

  // Filter out peers that may have connected but not sent data yet.
  const populatedPeers = peerKeys.filter(peerId => peers[peerId])

  return (
    <div {...{ className: 'OnlinePeersView' }}>
      {activePlayers - 1 > populatedPeers.length && (
        <p>Getting player information...</p>
      )}
      <h3>Your player name</h3>
      <Card>
        <CardContent>
          <strong>{getPlayerName(id)}</strong>
        </CardContent>
      </Card>
      {cowOfferedForTrade && (
        <>
          <Divider />
          <h3>You are offering to trade away</h3>
          <CowCard
            {...{
              cow: cowOfferedForTrade,
              isCowOfferedForTradeByPeer: false,
              isSelected: false,
            }}
          />
        </>
      )}
      {populatedPeers.length > 0 && (
        <>
          <Divider />
          <ul className="card-list">
            {sortBy(populatedPeers, [
              peerId =>
                // Use negative value to reverse sort order
                -levelAchieved(peers[peerId].experience || 0),
            ]).map(peerId => (
              <BailOutErrorBoundary {...{ key: peerId }}>
                <OnlinePeer {...{ peer: peers[peerId] }} />
              </BailOutErrorBoundary>
            ))}
          </ul>
        </>
      )}
      {latestPeerMessages.length > 0 && (
        <>
          <Divider />
          <ul>
            {latestPeerMessages.map(({ id, message, severity = 'info' }, i) => (
              <li {...{ key: i }}>
                <Alert
                  {...{
                    elevation: 3,
                    severity: /** @type {'success' | 'info' | 'warning' | 'error'} */ (severity),
                  }}
                >
                  <ReactMarkdown
                    {...{ source: `**${getPlayerName(id)}** ${message}` }}
                  />
                </Alert>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

OnlinePeersView.propTypes = {
  activePlayers: number.isRequired,
  cowIdOfferedForTrade: string.isRequired,
  cowInventory: array.isRequired,
  id: string.isRequired,
  latestPeerMessages: array.isRequired,
  peers: object.isRequired,
}

export { OnlinePeersView }

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <OnlinePeersView {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
