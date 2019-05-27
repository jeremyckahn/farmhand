import React from 'react';
import { func, number, string } from 'prop-types';

import Dinero from 'dinero.js';
import { default as MuiAppBar } from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import StepIcon from '@material-ui/core/StepIcon';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import Typography from '@material-ui/core/Typography';

import FarmhandContext from '../../Farmhand.context';
import { VIEW_LIST } from '../../constants';
import { stageFocusType } from '../../enums';
import './AppBar.sass';

const stageTitleMap = {
  [stageFocusType.FIELD]: 'Field',
  [stageFocusType.INVENTORY]: 'Inventory',
  [stageFocusType.SHOP]: 'Shop',
};

export const AppBar = ({
  handleClickNextMenuButton,
  handleClickPreviousMenuButton,
  handleMenuToggle,
  money,
  stageFocus,
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
          icon: VIEW_LIST.indexOf(stageFocus) + 1,
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
        $
        {Dinero({
          amount: Math.round(money * 100),
          precision: 2,
        })
          .toUnit()
          .toFixed(2)}
      </Typography>
    </Toolbar>
  </MuiAppBar>
);

AppBar.propTypes = {
  handleClickNextMenuButton: func.isRequired,
  handleClickPreviousMenuButton: func.isRequired,
  handleMenuToggle: func.isRequired,
  money: number.isRequired,
  stageFocus: string.isRequired,
};

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <AppBar {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  );
}
