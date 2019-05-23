import React from 'react';
import FarmhandContext from '../../Farmhand.context';
import Item from '../Item';
import { itemsMap } from '../../data/maps';
import { getItemValue } from '../../utils';
import { plotContentType } from '../../enums';
import { array, object } from 'prop-types';
import memoize from 'fast-memoize';
import sortBy from 'lodash.sortby';

import './Inventory.sass';

const sortItemIdsByTypeAndValue = memoize(itemIds =>
  sortBy(itemIds, [
    id => Number(itemsMap[id].type !== plotContentType.CROP),
    id => itemsMap[id].value,
  ])
);

export const sort = items => {
  const itemsMap = {};
  items.forEach(item => (itemsMap[item.id] = item));

  return sortItemIdsByTypeAndValue(items.map(({ id }) => id)).map(
    id => itemsMap[id]
  );
};

export const getItemCategories = items =>
  sort(items).reduce(
    (acc, item) => {
      acc[
        itemsMap[item.id].type === plotContentType.CROP ? 'seeds' : 'tools'
      ].push(item);

      return acc;
    },
    { seeds: [], tools: [] }
  );

export const Inventory = ({
  items,
  playerInventory,
  shopInventory,
  valueAdjustments,

  // Infer the type of view this is by doing an identity check against
  // gameState arrays.
  isPurchaseView = items === shopInventory,
  isSellView = items === playerInventory,

  itemCategories = getItemCategories(items),
}) => (
  <div className="Inventory">
    {[['seeds', 'Seeds'], ['tools', 'Field Tools']].map(
      ([category, headerText]) => (
        <section key={category}>
          <h2>{headerText}</h2>
          <ul>
            {itemCategories[category].map((item, i) => (
              <li key={i}>
                <Item
                  {...{
                    isPurchaseView,
                    isSellView,
                    item: {
                      ...item,
                      value: getItemValue(item, valueAdjustments),
                    },
                  }}
                />
              </li>
            ))}
          </ul>
        </section>
      )
    )}
  </div>
);

Inventory.propTypes = {
  items: array.isRequired,
  playerInventory: array,
  shopInventory: array,
  valueAdjustments: object.isRequired,
};

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Inventory {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  );
}
