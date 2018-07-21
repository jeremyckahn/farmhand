import React from 'react';
import { func, object } from 'prop-types';

const Item = ({ item, handlePurchaseItem }) => (
  <div className="item">
    <header>{item.name}</header>
    {handlePurchaseItem && (
      <button className="purchase" onClick={() => handlePurchaseItem(item)}>
        Buy
      </button>
    )}
  </div>
);

Item.propTypes = {
  item: object.isRequired,
  handlePurchaseItem: func,
};

export default Item;
