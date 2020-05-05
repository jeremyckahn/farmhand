import React from 'react'
import { arrayOf, func, number, string } from 'prop-types'

import { default as MuiAppBar } from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import StepIcon from '@material-ui/core/StepIcon'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import Typography from '@material-ui/core/Typography'

import FarmhandContext from '../../Farmhand.context'
import { stageFocusType } from '../../enums'
import { dollarAmount } from '../../utils'
import './AppBar.sass'

const stageTitleMap = {
  [stageFocusType.HOME]: 'Home',
  [stageFocusType.FIELD]: 'Field',
  [stageFocusType.SHOP]: 'Shop',
  [stageFocusType.COW_PEN]: 'Cows',
  [stageFocusType.KITCHEN]: 'Kitchen',
  [stageFocusType.INVENTORY]: 'Inventory',
}

export const AppBar = ({
  handleClickNextMenuButton,
  handleClickPreviousMenuButton,
  handleMenuToggle,
  money,
  stageFocus,
  viewList,
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
        {stageTitleMap[stageFocus]}
      </Typography>
      <Typography
        {...{
          className: 'money-display',
          variant: 'h2',
        }}
      >
        ${dollarAmount(money)}
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
