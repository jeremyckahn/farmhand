import React from 'react'
import classNames from 'classnames'

import AssignmentLateIcon from '@mui/icons-material/AssignmentLate.js'
import Card from '@mui/material/Card/index.js'
import CardHeader from '@mui/material/CardHeader/index.js'
import CardContent from '@mui/material/CardContent/index.js'
import BeenhereIcon from '@mui/icons-material/Beenhere.js'
import { bool, object, shape, string } from 'prop-types'

import FarmhandContext from '../Farmhand/Farmhand.context.js'

const Achievement = ({
  achievement: { description, id, name, rewardDescription },
  completedAchievements,

  isComplete = Boolean(completedAchievements[id]),
}: {
  achievement: farmhand.achievement
  completedAchievements: Partial<Record<string, boolean>>
  isComplete?: boolean
}) => (
  <Card
    {...{ className: classNames('Achievement', { 'is-complete': isComplete }) }}
    sx={{
      '& .MuiSvgIcon-root': { color: isComplete ? '#13b747' : '#666' },
    }}
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

export default function Consumer(props: {
  achievement: farmhand.achievement
  completedAchievements?: Partial<Record<string, boolean>>
  isComplete?: boolean
}) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Achievement {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
