import React from 'react'
import classNames from 'classnames'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import AssignmentIcon from '@material-ui/icons/Assignment'
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn'
import { bool, object } from 'prop-types'

import FarmhandContext from '../../Farmhand.context'

import './Achievement.sass'

const Achievement = ({
  achievement: { description, id, name, rewardDescription },
  completedAchievements,

  isComplete = Boolean(completedAchievements[id]),
}) => (
  <Card
    {...{ className: classNames('Achievement', { 'is-complete': isComplete }) }}
  >
    <CardHeader
      {...{
        avatar: isComplete ? <AssignmentTurnedInIcon /> : <AssignmentIcon />,
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
  completedAchievements: object.isRequired,
  isComplete: bool,
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
