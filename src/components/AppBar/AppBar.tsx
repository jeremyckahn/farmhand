import React, { useEffect, useRef, useState } from 'react'
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
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'

const MoneyDisplay = ({ money }: { money: number }) => {
  const idleColor = 'rgb(255, 255, 255)'
  const prefersReducedMotion = usePrefersReducedMotion()
  const [displayedMoney, setDisplayedMoney] = useState(money)
  const [textColor, setTextColor] = useState(idleColor)
  const previousMoneyRef = useRef(money)
  const tweenableRef = useRef<Tweenable | null>(null)

  useEffect(() => {
    tweenableRef.current?.cancel()
    tweenableRef.current = null

    if (prefersReducedMotion || previousMoneyRef.current === money) {
      previousMoneyRef.current = money
      setDisplayedMoney(money)
      setTextColor(idleColor)
      return
    }

    const startColor =
      money > previousMoneyRef.current ? 'rgb(0, 255, 0)' : 'rgb(255, 0, 0)'

    tweenableRef.current = tween({
      easing: 'easeOutQuad',
      duration: 750,
      render: ({ color, money: currentMoney }: any) => {
        setTextColor(String(color))
        setDisplayedMoney(Number(currentMoney))
      },
      from: {
        color: startColor,
        money: previousMoneyRef.current,
      },
      to: { color: idleColor, money },
    })

    previousMoneyRef.current = money

    return () => {
      tweenableRef.current?.cancel()
      tweenableRef.current = null
    }
  }, [money, prefersReducedMotion])

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
