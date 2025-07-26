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
import './AppBar.sass'

/**
 * Displays formatted monetary value.
 *
 * @param {Object} props - The component props.
 * @param {number} props.money - The amount of money to display.
 */
const MoneyDisplay = ({ money }) => {
  const idleColor = 'rgb(255, 255, 255)'
  const [displayedMoney, setDisplayedMoney] = useState(money)
  const [textColor, setTextColor] = useState(idleColor)
  const [previousMoney, setPreviousMoney] = useState(money)
  /**
   * @type {ReturnType<typeof useState<Tweenable | undefined>>}
   */
  const [currentTweenable, setCurrentTweenable] = useState()

  useEffect(() => {
    setPreviousMoney(money)
  }, [money, setPreviousMoney])

  useEffect(() => {
    if (money !== previousMoney) {
      currentTweenable?.cancel()

      const tweenable = tween({
        easing: 'easeOutQuad',
        duration: 750,
        render: ({ color, money }) => {
          setTextColor(String(color))
          setDisplayedMoney(Number(money))
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
