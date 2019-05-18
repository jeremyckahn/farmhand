import React from 'react';
import classNames from 'classnames';
import Dinero from 'dinero.js';
import FarmhandContext from '../../Farmhand.context';
import { array, arrayOf, bool, func, number, string } from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import StepIcon from '@material-ui/core/StepIcon';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import Typography from '@material-ui/core/Typography';
import Field from '../Field';
import Inventory from '../Inventory';
import Shop from '../Shop';
import { VIEW_LIST } from '../../constants';
import { stageFocusType } from '../../enums';

import './Stage.sass';

const stageTitleMap = {
  [stageFocusType.FIELD]: 'Field',
  [stageFocusType.INVENTORY]: 'Inventory',
  [stageFocusType.SHOP]: 'Shop',
};

export const Stage = ({
  field,
  handleClickNextMenuButton,
  handleClickPreviousMenuButton,
  handleMenuToggle,
  isMenuOpen,
  money,
  playerInventory,
  stageFocus,
}) => (
  <div className={classNames('Stage', { 'menu-closed': !isMenuOpen })}>
    <AppBar position="fixed">
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
    </AppBar>
    {stageFocus === stageFocusType.FIELD && (
      <Field
        {...{
          columns: field[0].length,
          rows: field.length,
        }}
      />
    )}
    {stageFocus === stageFocusType.INVENTORY && (
      <Inventory
        {...{
          items: playerInventory,
        }}
      />
    )}
    {stageFocus === stageFocusType.SHOP && <Shop />}
  </div>
);

Stage.propTypes = {
  field: arrayOf(array).isRequired,
  handleClickNextMenuButton: func.isRequired,
  handleClickPreviousMenuButton: func.isRequired,
  handleMenuToggle: func.isRequired,
  money: number.isRequired,
  isMenuOpen: bool.isRequired,
  playerInventory: array.isRequired,
  stageFocus: string.isRequired,
};

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Stage {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  );
}
