import React from 'react'
import { number, object, shape, string } from 'prop-types'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'

import CowCard from '../../CowCard'

import { moneyString } from '../../../utils/moneyString'
import { levelAchieved } from '../../../utils/levelAchieved'
import { getPlayerName, integerString } from '../../../utils'

import './OnlinePeer.sass'

const OnlinePeer = ({
  peer: { cowOfferedForTrade, dayCount, id, experience, money },
}) => {
  return (
    <li>
      <Card>
        <CardHeader
          {...{
            title: getPlayerName(id),
            subheader: (
              <div>
                <p>Day: {integerString(dayCount)}</p>
                <p>Level: {integerString(levelAchieved({ experience }))}</p>
                <p>Money: {moneyString(money)}</p>
              </div>
            ),
          }}
        />
        <CardContent>
          {cowOfferedForTrade && (
            <CowCard
              {...{ cow: cowOfferedForTrade, isCowOfferedForTradeByPeer: true }}
            />
          )}
        </CardContent>
      </Card>
    </li>
  )
}

OnlinePeer.propTypes = {
  peer: shape({
    cowOfferedForTrade: object,
    dayCount: number.isRequired,
    experience: number.isRequired,
    id: string.isRequired,
    money: number.isRequired,
  }).isRequired,
}

export default OnlinePeer
