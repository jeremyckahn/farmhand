import React from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import sortBy from 'lodash.sortby'
import { number, object, string } from 'prop-types'

import {
  getPlayerName,
  farmProductsSold,
  integerString,
  levelAchieved,
  moneyString,
} from '../../utils'
import FarmhandContext from '../../Farmhand.context'

import './OnlinePeersView.sass'

const OnlinePeersView = ({ activePlayers, id, peers }) => {
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
          // Use negative value to reverse sort order
          peerId => -levelAchieved(farmProductsSold(peers[peerId].itemsSold)),
        ]).map(peerId => {
          const { dayCount, id, itemsSold, money } = peers[peerId]

          return (
            <li {...{ key: peerId }}>
              <Card>
                <CardHeader
                  {...{
                    title: getPlayerName(id),
                    subheader: (
                      <div>
                        <p>Day: {integerString(dayCount)}</p>
                        <p>
                          Level:{' '}
                          {integerString(
                            levelAchieved(farmProductsSold(itemsSold))
                          )}
                        </p>
                        <p>Money: {moneyString(money)}</p>
                      </div>
                    ),
                  }}
                />
              </Card>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

OnlinePeersView.propTypes = {}

OnlinePeersView.propTypes = {
  activePlayers: number.isRequired,
  id: string.isRequired,
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
