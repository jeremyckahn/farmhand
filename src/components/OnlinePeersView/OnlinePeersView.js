import React from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
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
  const populatedPeers = peerKeys.filter(peerId => peers[peerId])

  return (
    <div {...{ className: 'OnlinePeersView' }}>
      <p>
        Your player name: <strong>{getPlayerName(id)}</strong>
      </p>
      {activePlayers - 1 > populatedPeers.length && <p>Waiting for peers...</p>}
      <ul className="card-list">
        {/* FIXME: Sort peers by some stat, like money */}
        {peerKeys.map(peerId => {
          const peerData = peers[peerId]

          // Peer may have connected but not sent data yet. Bail out in that case.
          if (peerData === null) {
            return null
          }

          const { dayCount, id, itemsSold, money } = peerData

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
