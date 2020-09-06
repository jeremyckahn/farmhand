import React, { useEffect, useState } from 'react'
import { tween } from 'shifty'
import { func, number, string } from 'prop-types'
import classNames from 'classnames'

import { default as MuiAppBar } from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Typography from '@material-ui/core/Typography'

import FarmhandContext from '../../Farmhand.context'
import { moneyString } from '../../utils'
import './AppBar.sass'

const MoneyDisplay = ({ money }) => {
  const [displayedMoney, setDisplayedMoney] = useState(money)
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

      const { tweenable } = tween({
        duration: 750,
        render: ({ money }) => setDisplayedMoney(money),
        from: { money: previousMoney },
        to: { money },
      })

      setCurrentTweenable(tweenable)
    }

    return () => {
      if (currentTweenable) {
        currentTweenable.cancel()
      }
    }
  }, [currentTweenable, money, previousMoney])

  return moneyString(displayedMoney)
}

export const AppBar = ({ handleMenuToggle, money, isMenuOpen, viewTitle }) => (
  <MuiAppBar
    {...{
      className: 'AppBar',
      position: 'fixed',
    }}
  >
    <Toolbar
      {...{
        className: 'toolbar',
      }}
    >
      <IconButton
        className={classNames('menu-button', { 'is-open': isMenuOpen })}
        color="inherit"
        aria-label="Open drawer"
        onClick={() => handleMenuToggle()}
      >
        <MenuIcon />
      </IconButton>
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
  handleMenuToggle: func.isRequired,
  money: number.isRequired,
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
