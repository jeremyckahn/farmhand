import React from 'react';
import { func, string } from 'prop-types';

const Item = ({ name, handlePurchaseItem }) => (
  <div className="item">
    <header>{name}</header>
    {handlePurchaseItem && (
      <button className="purchase" onClick={handlePurchaseItem}>
        Buy
      </button>
    )}
  </div>
);

Item.propTypes = {
  name: string.isRequired,
  handlePurchaseItem: func,
};

export default Item;
