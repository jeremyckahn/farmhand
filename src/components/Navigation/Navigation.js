import React from 'react';
import Dinero from 'dinero.js';
import { func, number, shape, string } from 'prop-types';
import { stageFocusType } from '../../enums';

import './Navigation.sass';

const Navigation = ({
  handlers: { handleViewChange, handleEndDayButtonClick },
  state: { money, stageFocus },
}) => (
  <header className="Navigation">
    <h1>Farmhand</h1>
    <button className="end-day" onClick={handleEndDayButtonClick}>
      Call it a day
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
  handlers: shape({
    handleViewChange: func.isRequired,
    handleEndDayButtonClick: func.isRequired,
  }).isRequired,
  state: shape({
    money: number.isRequired,
    stageFocus: string.isRequired,
  }).isRequired,
};

export default Navigation;
