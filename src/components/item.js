import React from 'react';
import { func, number, object } from 'prop-types';

const Item = ({
  handlePurchaseItem,
  item,
  money,
  isPurchaseView = !!handlePurchaseItem, // eslint-disable-line react/prop-types
}) => (
  <div className="item">
    <header>
      <h2>{item.name}</h2>
      <h3>
        {isPurchaseView ? `Price: ${item.value}` : `Sell price: ${item.value}`}
      </h3>
    </header>
    {isPurchaseView && (
      <button
        className="purchase"
        disabled={item.value > money}
        onClick={() => handlePurchaseItem(item)}
      >
        Buy
      </button>
    )}
    {typeof item.quantity === 'number' && (
      <p>
        <strong>Quantity:</strong> {item.quantity}
      </p>
    )}
  </div>
);

Item.propTypes = {
  handlePurchaseItem: func,
  item: object.isRequired,
  money: number.isRequired,
};

export default Item;
