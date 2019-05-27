import React from 'react';
import classNames from 'classnames';
import { array, arrayOf, bool, func, string } from 'prop-types';
import Fab from '@material-ui/core/Fab';
import HotelIcon from '@material-ui/icons/Hotel';
import Tooltip from '@material-ui/core/Tooltip';

import FarmhandContext from '../../Farmhand.context';
import Field from '../Field';
import Inventory from '../Inventory';
import Shop from '../Shop';
import { stageFocusType } from '../../enums';

import './Stage.sass';

export const Stage = ({
  field,
  handleClickEndDayButton,
  isMenuOpen,
  playerInventory,
  stageFocus,
}) => (
  <div className={classNames('Stage', { 'menu-closed': !isMenuOpen })}>
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
    <Tooltip
      {...{
        title: 'End the day',
      }}
    >
      <Fab
        {...{
          'aria-label': 'End the day',
          className: 'end-day',
          color: 'primary',
          onClick: handleClickEndDayButton,
        }}
      >
        <HotelIcon />
      </Fab>
    </Tooltip>
  </div>
);

Stage.propTypes = {
  field: arrayOf(array).isRequired,
  handleClickEndDayButton: func.isRequired,
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
