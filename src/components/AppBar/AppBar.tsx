import React, { useEffect, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { tween, Tweenable } from 'shifty'
import { array, bool, func, number, string } from 'prop-types'

import { default as MuiAppBar } from '@mui/material/AppBar/index.js'
import Toolbar from '@mui/material/Toolbar/index.js'
import Typography from '@mui/material/Typography/index.js'
import StepIcon from '@mui/material/StepIcon/index.js'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { moneyString } from '../../utils/moneyString.js'
import { breakpoints } from '../../styles/tokens.js'

const MoneyDisplay = ({ money }: { money: number }) => {
  const idleColor = 'rgb(255, 255, 255)'
  const [displayedMoney, setDisplayedMoney] = useState(money)
  const [textColor, setTextColor] = useState(idleColor)
  const [previousMoney, setPreviousMoney] = useState(money)
  const [currentTweenable, setCurrentTweenable] = useState<
    Tweenable | undefined
  >()

  useEffect(() => {
    setPreviousMoney(money)
  }, [money, setPreviousMoney])

  useEffect(() => {
    if (money !== previousMoney) {
      currentTweenable?.cancel()

      const tweenable = tween({
        easing: 'easeOutQuad',
        duration: 750,
        render: ({ color, money: currentMoney }: any) => {
          setTextColor(String(color))
          setDisplayedMoney(Number(currentMoney))
        },
        from: {
          color: money > previousMoney ? 'rgb(0, 255, 0)' : 'rgb(255, 0, 0)',
          money: previousMoney,
        },
        to: { color: idleColor, money },
      })

      setCurrentTweenable(tweenable)
    }

    return () => {
      currentTweenable?.cancel()
    }
  }, [currentTweenable, money, previousMoney])

  return (
    <span
      {...{
        style: {
          color: textColor,
        },
      }}
    >
      {moneyString(displayedMoney)}
    </span>
  )
}

export const AppBar = ({
  handleClickNotificationIndicator,
  money,
  showNotifications,
  todaysNotifications,
  viewTitle,

  areAnyNotificationsErrors = todaysNotifications.some(
    ({ severity }) => severity === 'error'
  ),
}: {
  handleClickNotificationIndicator: () => void
  money: number
  showNotifications: boolean
  todaysNotifications: farmhand.notification[]
  viewTitle: string
  areAnyNotificationsErrors?: boolean
}) => (
  <MuiAppBar
    {...{
      className: 'AppBar top-level',
      position: 'fixed',
    }}
    sx={{
      '& .toolbar': {
        display: 'flex',
        '& h2': {
          color: '#fff',
          fontFamily: '"Francois One", monospace',
          fontSize: '1.2em',
        },
        '& .stage-header': {
          display: 'none',
          marginLeft: '1em',
          [`@media (min-width: ${breakpoints.mediumPhone}px)`]: {
            display: 'block',
          },
        },
        '& .money-display': {
          position: 'absolute',
          right: '1em',
        },
        '& .notification-indicator-container': {
          display: 'flex',
          '& .error-indicator': { marginLeft: '1em' },
        },
      },
    }}
  >
    <Toolbar
      {...{
        className: 'toolbar',
      }}
    >
      {!showNotifications && (
        <div
          {...{
            className: 'notification-indicator-container',
            onClick: handleClickNotificationIndicator,
          }}
        >
          <Typography>
            <StepIcon {...{ icon: todaysNotifications.length }} />
          </Typography>
          {areAnyNotificationsErrors && (
            <Typography
              {...{
                className: 'error-indicator',
              }}
            >
              <StepIcon {...{ error: true, icon: '' }} />
            </Typography>
          )}
        </div>
      )}
      <Typography
        {...{
          className: 'stage-header',
          variant: 'h2',
        }}
      >
        {viewTitle}
      </Typography>
      <Typography
        {...{
          className: 'money-display',
          variant: 'h2',
        }}
      >
        <MoneyDisplay {...{ money }} />
      </Typography>
    </Toolbar>
  </MuiAppBar>
)

AppBar.propTypes = {
  handleClickNotificationIndicator: func.isRequired,
  money: number.isRequired,
  showNotifications: bool.isRequired,
  todaysNotifications: array.isRequired,
  viewTitle: string.isRequired,
}

export default function Consumer(props: Partial<Parameters<typeof AppBar>[0]>) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <AppBar
          {...({
            ...gameState,
            ...handlers,
            ...props,
          } as Parameters<typeof AppBar>[0])}
        />
      )}
    </FarmhandContext.Consumer>
  )
}
