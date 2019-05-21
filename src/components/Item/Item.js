import React from 'react';
import FarmhandContext from '../../Farmhand.context';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import { bool, func, number, object } from 'prop-types';
import classNames from 'classnames';
import { items } from '../../img';

import './Item.sass';

export const Item = ({
  handleItemPurchase,
  handleItemSelect,
  handleItemSell,
  isPurchaseView,
  isSelected,
  isSelectView,
  isSellView,
  item,
  item: { id, name, quantity, value },
  money,
}) => (
  <Card
    {...{
      className: classNames('Item', { 'is-selected': isSelected }),
      raised: isSelected,
    }}
  >
    <CardHeader
      {...{
        avatar: <img {...{ src: items[id] }} alt={name} />,
        title: name,
        subheader: (
          <div>
            {isPurchaseView && <p>{`Price: $${value.toFixed(2)}`}</p>}
            {isSellView && <p>{`Sell price: $${value.toFixed(2)}`}</p>}
            {typeof quantity === 'number' && (
              <p>
                <strong>Quantity:</strong> {quantity}
              </p>
            )}
          </div>
        ),
      }}
    />
    <CardActions>
      {isSelectView && (
        <Button
          {...{
            className: 'select',
            color: 'primary',
            onClick: () => handleItemSelect(item),
            variant: isSelected ? 'contained' : 'outlined',
          }}
        >
          Select
        </Button>
      )}
      {isPurchaseView && (
        <Button
          {...{
            className: 'purchase',
            color: 'primary',
            disabled: value > money,
            onClick: () => handleItemPurchase(item),
            variant: 'contained',
          }}
        >
          Buy
        </Button>
      )}
      {isSellView && (
        <Button
          {...{
            className: 'sell',
            color: 'secondary',
            onClick: () => handleItemSell(item),
            variant: 'contained',
          }}
        >
          Sell
        </Button>
      )}
    </CardActions>
  </Card>
);

Item.propTypes = {
  handleItemPurchase: func,
  handleItemSelect: func,
  handleItemSell: func,
  isPurchaseView: bool,
  isSelected: bool,
  isSelectView: bool,
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
