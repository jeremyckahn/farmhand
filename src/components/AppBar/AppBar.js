import React, { useEffect, useState } from 'react'
import { tween } from 'shifty'
import { array, bool, func, number, string } from 'prop-types'

import { default as MuiAppBar } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import StepIcon from '@mui/material/StepIcon'

import FarmhandContext from '../Farmhand/Farmhand.context'
import { moneyString } from '../../utils/moneyString'
import './AppBar.sass'

const MoneyDisplay = ({ money }) => {
  const idleColor = 'rgb(255, 255, 255)'
  const [displayedMoney, setDisplayedMoney] = useState(money)
  const [textColor, setTextColor] = useState(idleColor)
  const [previousMoney, setPreviousMoney] = useState(money)
  const [currentTweenable, setCurrentTweenable] = useState()

  useEffect(() => {
    setPreviousMoney(money)
  }, [money, setPreviousMoney])

  useEffect(() => {
    if (money !== previousMoney) {
      if (currentTweenable) {
        currentTweenable.cancel()
      }

      const tweenable = tween({
        easing: 'easeOutQuad',
        duration: 750,
        render: ({ color, money }) => {
          setTextColor(color)
          setDisplayedMoney(money)
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
      if (currentTweenable) {
        currentTweenable.cancel()
      }
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
}) => (
  <MuiAppBar
    {...{
      className: 'AppBar top-level',
      position: 'fixed',
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
            <StepIcon
              {...{ icon: Math.max(0, todaysNotifications.length - 1) }}
            />
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

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <AppBar {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
