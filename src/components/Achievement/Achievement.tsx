import React from 'react'
import classNames from 'classnames'

import AssignmentLateIcon from '@mui/icons-material/AssignmentLate.js'
import Card from '@mui/material/Card/index.js'
import CardHeader from '@mui/material/CardHeader/index.js'
import CardContent from '@mui/material/CardContent/index.js'
import BeenhereIcon from '@mui/icons-material/Beenhere.js'
import { bool, object, shape, string } from 'prop-types'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { Div } from '../Elements/index.js'
import ProgressBar from '../ProgressBar/index.js'

const Achievement = ({
  achievement,
  completedAchievements,
  gameState,

  isComplete = Boolean(completedAchievements[achievement.id]),
}: {
  achievement: farmhand.achievement
  completedAchievements: Partial<Record<string, boolean>>
  gameState: farmhand.state
  isComplete?: boolean
}) => {
  const { description, name, rewardDescription } = achievement
  const progress = achievement.getProgress?.(gameState)

  return (
    <Card
      {...{
        className: classNames('Achievement', { 'is-complete': isComplete }),
      }}
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
        {!isComplete && progress && (
          <Div sx={{ marginTop: '1em' }}>
            <ProgressBar
              {...{
                percent: Math.min(
                  100,
                  (progress.currentValue / progress.goal) * 100
                ),
              }}
            />
          </Div>
        )}
      </CardContent>
    </Card>
  )
}

Achievement.propTypes = {
  achievement: shape({
    description: string.isRequired,
    id: string.isRequired,
    name: string.isRequired,
    rewardDescription: string.isRequired,
  }).isRequired,
  completedAchievements: object.isRequired,
  gameState: object.isRequired,
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
        <Achievement {...{ ...gameState, ...handlers, ...props, gameState }} />
      )}
    </FarmhandContext.Consumer>
  )
}
