import React from 'react';
import FarmhandContext from '../../Farmhand.context';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { func, string } from 'prop-types';
import { stageFocusType } from '../../enums';

import './Navigation.sass';

export const Navigation = ({
  handleEndDayButtonClick,
  handleViewChange,
  stageFocus,
}) => (
  <header className="Navigation">
    <h1>Farmhand</h1>
    <Button
      {...{
        className: 'end-day',
        onClick: handleEndDayButtonClick,
        variant: 'contained',
      }}
    >
      Call it a day (c)
    </Button>
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
  handleEndDayButtonClick: func.isRequired,
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
