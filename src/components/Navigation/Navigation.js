import React from 'react';
import FarmhandContext from '../../Farmhand.context';
import Dinero from 'dinero.js';
import { func, number, string } from 'prop-types';
import { stageFocusType } from '../../enums';

import './Navigation.sass';

export const Navigation = ({
  handleEndDayButtonClick,
  handleViewChange,
  money,
  stageFocus,
}) => (
  <header className="Navigation">
    <h1>Farmhand</h1>
    <button className="end-day" onClick={handleEndDayButtonClick}>
      Call it a day (c)
    </button>
    <h2>
      You have: $
      {Dinero({
        amount: Math.round(money * 100),
        precision: 2,
      }).toUnit()}
    </h2>
    <select onChange={handleViewChange} value={stageFocus}>
      <option value={stageFocusType.FIELD}>Field (f)</option>
      <option value={stageFocusType.INVENTORY}>Inventory (i)</option>
      <option value={stageFocusType.SHOP}>Shop (s)</option>
    </select>
  </header>
);

Navigation.propTypes = {
  handleEndDayButtonClick: func.isRequired,
  handleViewChange: func.isRequired,
  money: number.isRequired,
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
