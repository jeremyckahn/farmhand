import React from 'react';
import classNames from 'classnames';
import FarmhandContext from '../../Farmhand.context';
import { array, arrayOf, bool, func, string } from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Field from '../Field';
import Inventory from '../Inventory';
import Shop from '../Shop';
import { stageFocusType } from '../../enums';

import './Stage.sass';

const stageTitleMap = {
  [stageFocusType.FIELD]: 'Field',
  [stageFocusType.INVENTORY]: 'Your inventory',
  [stageFocusType.SHOP]: 'Shop',
};

export const Stage = ({
  field,
  handleMenuToggle,
  isMenuOpen,
  playerInventory,
  stageFocus,
}) => (
  <div className={classNames('Stage', { 'menu-closed': !isMenuOpen })}>
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          onClick={handleMenuToggle}
        >
          <MenuIcon />
        </IconButton>
        <Typography className="stage-header">
          {stageTitleMap[stageFocus]}
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
  handleMenuToggle: func.isRequired,
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
