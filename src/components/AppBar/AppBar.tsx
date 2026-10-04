import React, { useEffect, useRef, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { tween, Tweenable } from 'shifty'

import { default as MuiAppBar } from '@mui/material/AppBar/index.js'
import Toolbar from '@mui/material/Toolbar/index.js'
import Typography from '@mui/material/Typography/index.js'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { WarningIcon } from '../PixelIcon/index.js'
import { seasonNameMap } from '../../data/seasons.js'
import { getCurrentSeason } from '../../utils/getCurrentSeason.js'
import { getDayOfSeason } from '../../utils/getDayOfSeason.js'
import { moneyString } from '../../utils/moneyString.js'
import { pixelBevel, pixelFrameSx } from '../../styles/pixel.js'
import { breakpoints, colors, fonts } from '../../styles/tokens.js'
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
  dayCount,
  handleClickNotificationIndicator,
  money,
  showNotifications,
  todaysNotifications,
  viewTitle,

  areAnyNotificationsErrors = todaysNotifications.some(
    ({ severity }) => severity === 'error'
  ),
}: {
  dayCount: number
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
          fontFamily: fonts.display,
          fontSize: '1.2em',
        },
        '& .stage-header': {
          display: 'none',
          marginLeft: '1em',
          // Matches Stage.tsx's own `.view-title` breakpoint, which hides
          // at the same width this shows at - otherwise there's a range
          // where both are visible at once, showing the view title twice.
          [`@media (min-width: ${breakpoints.largePhone}px)`]: {
            display: 'block',
          },
        },
        '& .season-display': {
          marginLeft: '1em',
          [`@media (min-width: ${breakpoints.largePhone}px)`]: {
            position: 'absolute',
            left: '50%',
            marginLeft: 0,
            transform: 'translateX(-50%)',
          },
        },
        '& .money-display': {
          position: 'absolute',
          right: '1em',
        },
        '& .notification-indicator-container': {
          alignItems: 'center',
          cursor: 'pointer',
          display: 'flex',
          '& .notification-count': {
            ...pixelFrameSx({ outline: colors.neutralOutline }),
            backgroundColor: 'rgba(0, 0, 0, 0.38)',
            boxShadow: pixelBevel(),
            color: '#fff',
            fontFamily: fonts.display,
            lineHeight: 1,
            minWidth: '1.5em',
            padding: '0.2em 0.35em',
            textAlign: 'center',
          },
          '& .error-indicator': { display: 'flex', marginLeft: '1em' },
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
          <Typography {...{ className: 'notification-count' }}>
            {todaysNotifications.length}
          </Typography>
          {areAnyNotificationsErrors && (
            <Typography
              {...{
                className: 'error-indicator',
              }}
            >
              <WarningIcon {...{ color: 'error' }} />
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
          className: 'season-display',
          variant: 'h2',
        }}
      >
        {`Day ${getDayOfSeason(dayCount)} of ${
          seasonNameMap[getCurrentSeason(dayCount)]
        }`}
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
