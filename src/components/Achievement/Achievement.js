import React from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import AssignmentIcon from '@material-ui/icons/Assignment'
import { object } from 'prop-types'

import FarmhandContext from '../../Farmhand.context'

import './Achievement.sass'

const Achievement = ({
  achievement: { name, description, rewardDescription },
}) => (
  <Card className="Achievement">
    <CardHeader
      {...{
        avatar: <AssignmentIcon />,
        title: name,
        subheader: <p>Reward: {rewardDescription}</p>,
      }}
    />
    <CardContent>
      <p>{description}</p>
    </CardContent>
  </Card>
)

Achievement.propTypes = {
  achievement: object.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Achievement {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
