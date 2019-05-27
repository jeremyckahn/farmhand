import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { number, func, string } from 'prop-types';

import FarmhandContext from '../../Farmhand.context';
import { stageFocusType } from '../../enums';

import './Navigation.sass';

export const Navigation = ({ dayCount, handleViewChange, stageFocus }) => (
  <header className="Navigation">
    <h1>Farmhand</h1>
    <h2 className="day-count">Day {dayCount}</h2>
    <Select
      {...{
        className: 'view-select',
        onChange: handleViewChange,
        value: stageFocus,
      }}
    >
      <MenuItem value={stageFocusType.FIELD}>Field (f)</MenuItem>
      <MenuItem value={stageFocusType.INVENTORY}>Inventory (i)</MenuItem>
      <MenuItem value={stageFocusType.SHOP}>Shop (s)</MenuItem>
    </Select>
  </header>
);

Navigation.propTypes = {
  dayCount: number.isRequired,
  handleViewChange: func.isRequired,
  stageFocus: string.isRequired,
};

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Navigation {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  );
}
