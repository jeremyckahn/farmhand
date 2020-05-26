import React from 'react'
import { arrayOf, func, number, string } from 'prop-types'
import classNames from 'classnames'

import { default as MuiAppBar } from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import StepIcon from '@material-ui/core/StepIcon'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import Typography from '@material-ui/core/Typography'

import FarmhandContext from '../../Farmhand.context'
import { moneyString } from '../../utils'
import './AppBar.sass'

export const AppBar = ({
  handleClickNextMenuButton,
  handleClickPreviousMenuButton,
  handleMenuToggle,
  money,
  isMenuOpen,
  stageFocus,
  viewList,
  viewTitle,
}) => (
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
        onClick={handleMenuToggle}
      >
        <MenuIcon />
      </IconButton>
      <IconButton
        color="inherit"
        aria-label="Previous view"
        onClick={handleClickPreviousMenuButton}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        color="inherit"
        aria-label="Next view"
        onClick={handleClickNextMenuButton}
      >
        <KeyboardArrowRight />
      </IconButton>
      <StepIcon
        {...{
          icon: viewList.indexOf(stageFocus) + 1,
        }}
      />
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
  handleClickNextMenuButton: func.isRequired,
  handleClickPreviousMenuButton: func.isRequired,
  handleMenuToggle: func.isRequired,
  money: number.isRequired,
  stageFocus: string.isRequired,
  viewList: arrayOf(string).isRequired,
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
