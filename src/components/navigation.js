import React from 'react';
import { func } from 'prop-types';
import { stageFocusType } from '../enums';

const Navigation = ({ handleChangeView }) => (
  <header className="navigation">
    <h1>Farmhand</h1>
    <select onChange={handleChangeView}>
      <option value={stageFocusType.INVENTORY}>Inventory</option>
      <option value={stageFocusType.SHOP}>Shop</option>
    </select>
  </header>
);

Navigation.propTypes = {
  handleChangeView: func.isRequired,
};

export default Navigation;
