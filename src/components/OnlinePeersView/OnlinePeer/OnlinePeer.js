import React from 'react'
import { number, object, shape, string } from 'prop-types'
import Card from '@mui/material/Card/index.js'
import CardContent from '@mui/material/CardContent/index.js'
import CardHeader from '@mui/material/CardHeader/index.js'

import CowCard from '../../CowCard/index.js'

import { moneyString } from '../../../utils/moneyString.js'
import { levelAchieved } from '../../../utils/levelAchieved.js'
import { getPlayerName, integerString } from '../../../utils/index.js'

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
                {/* TODO: Remove `?? 0` after 10/24 */}
                <p>Level: {integerString(levelAchieved(experience ?? 0))}</p>
                <p>Money: {moneyString(money)}</p>
              </div>
            ),
          }}
        />
        <CardContent>
          {cowOfferedForTrade && (
            <CowCard
              {...{
                cow: cowOfferedForTrade,
                isCowOfferedForTradeByPeer: true,
                isSelected: false,
              }}
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
