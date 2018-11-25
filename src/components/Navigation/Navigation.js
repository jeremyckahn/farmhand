import React from 'react';
import Dinero from 'dinero.js';
import { func, number, shape, string } from 'prop-types';
import { stageFocusType } from '../../enums';

import './Navigation.sass';

const Navigation = ({
  handlers: { handleChangeView, handleClickEndDayButton },
  state: { money, stageFocus },
}) => (
  <header className="Navigation">
    <h1>Farmhand</h1>
    <button className="end-day" onClick={handleClickEndDayButton}>
      Call it a day
    </button>
    <h2>
      You have: $
      {Dinero({
        amount: Math.round(money * 100),
        precision: 2,
      }).toUnit()}
    </h2>
    <select onChange={handleChangeView} value={stageFocus}>
      <option value={stageFocusType.FIELD}>Field</option>
      <option value={stageFocusType.INVENTORY}>Inventory</option>
      <option value={stageFocusType.SHOP}>Shop</option>
    </select>
  </header>
);

Navigation.propTypes = {
  handlers: shape({
    handleChangeView: func.isRequired,
    handleClickEndDayButton: func.isRequired,
  }).isRequired,
  state: shape({
    money: number.isRequired,
    stageFocus: string.isRequired,
  }).isRequired,
};

export default Navigation;
