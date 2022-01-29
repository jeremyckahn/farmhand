import React from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'

import { number, object, shape, string } from 'prop-types'

import {
  getPlayerName,
  farmProductsSold,
  integerString,
  levelAchieved,
  moneyString,
} from '../../../utils'

import './OnlinePeer.sass'

const OnlinePeer = ({ peer: { dayCount, id, itemsSold, money } }) => (
  <li>
    <Card>
      <CardHeader
        {...{
          title: getPlayerName(id),
          subheader: (
            <div>
              <p>Day: {integerString(dayCount)}</p>
              <p>
                Level:{' '}
                {integerString(levelAchieved(farmProductsSold(itemsSold)))}
              </p>
              <p>Money: {moneyString(money)}</p>
            </div>
          ),
        }}
      />
    </Card>
  </li>
)

OnlinePeer.propTypes = {
  peer: shape({
    dayCount: number.isRequired,
    id: string.isRequired,
    itemsSold: object.isRequired,
    money: number.isRequired,
  }).isRequired,
}

export default OnlinePeer
