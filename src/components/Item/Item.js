import React from 'react';
import FarmhandContext from '../../Farmhand.context';
import { bool, func, number, object } from 'prop-types';
import classNames from 'classnames';
import { items } from '../../img';

import './Item.sass';

export const Item = ({
  handleItemPurchase,
  handleItemSell,
  isPurchaseView,
  isSelected,
  isSellView,
  item,
  item: { id, name, quantity, value },
  money,
}) => (
  <div className={classNames('Item', { 'is-selected': isSelected })}>
    <header>
      <h2>{name}</h2>
      <p>{isPurchaseView ? `Price: ${value}` : `Sell price: ${value}`}</p>
    </header>
    <img src={items[id]} alt={name} />
    {isPurchaseView && (
      <button
        className="purchase"
        disabled={value > money}
        onClick={() => handleItemPurchase(item)}
      >
        Buy
      </button>
    )}
    {isSellView && (
      <button className="sell" onClick={() => handleItemSell(item)}>
        Sell
      </button>
    )}
    {typeof quantity === 'number' && (
      <p>
        <strong>Quantity:</strong> {quantity}
      </p>
    )}
  </div>
);

Item.propTypes = {
  handleItemPurchase: func,
  handleItemSell: func,
  isPurchaseView: bool,
  isSelected: bool,
  isSellView: bool,
  item: object.isRequired,
  money: number.isRequired,
};

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Item {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  );
}
