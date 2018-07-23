import React from 'react';
import { func, number, object } from 'prop-types';

const Item = ({ item, handlePurchaseItem, money }) => (
  <div className="item">
    <header>{item.name}</header>
    {handlePurchaseItem && (
      <button
        className="purchase"
        disabled={item.value > money}
        onClick={() => handlePurchaseItem(item)}
      >
        Buy
      </button>
    )}
  </div>
);

Item.propTypes = {
  handlePurchaseItem: func,
  item: object.isRequired,
  money: number.isRequired,
};

export default Item;
