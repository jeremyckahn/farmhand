import React from 'react';
import FarmhandContext from '../../Farmhand.context';
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
    <button className="end-day" onClick={handleEndDayButtonClick}>
      Call it a day (c)
    </button>
    <select
      className="view-select"
      onChange={handleViewChange}
      value={stageFocus}
    >
      <option value={stageFocusType.FIELD}>Field (f)</option>
      <option value={stageFocusType.INVENTORY}>Inventory (i)</option>
      <option value={stageFocusType.SHOP}>Shop (s)</option>
    </select>
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
