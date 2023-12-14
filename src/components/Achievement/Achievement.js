import React from 'react'
import classNames from 'classnames'

import AssignmentLateIcon from '@mui/icons-material/AssignmentLate'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import BeenhereIcon from '@mui/icons-material/Beenhere'
import { bool, object, shape, string } from 'prop-types'

import FarmhandContext from '../Farmhand/Farmhand.context'

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
        avatar: isComplete ? <BeenhereIcon /> : <AssignmentLateIcon />,
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
  achievement: shape({
    description: string.isRequired,
    id: string.isRequired,
    name: string.isRequired,
    rewardDescription: string.isRequired,
  }).isRequired,
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
