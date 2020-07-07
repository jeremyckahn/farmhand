import React from 'react'
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
        {moneyString(money)}
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
