import React from 'react'
import classNames from 'classnames'

import Card from '@mui/material/Card/index.js'
import CardHeader from '@mui/material/CardHeader/index.js'
import CardContent from '@mui/material/CardContent/index.js'

import { AssignmentLateIcon, BeenhereIcon } from '../PixelIcon/index.js'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { Div } from '../Elements/index.js'
import ProgressBar from '../ProgressBar/index.js'
import { colors } from '../../styles/tokens.js'

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
        '& .MuiSvgIcon-root': {
          color: isComplete ? colors.success : colors.textSecondary,
        },
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
