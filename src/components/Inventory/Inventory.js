import React from 'react';
import { array, object } from 'prop-types';
import memoize from 'fast-memoize';
import sortBy from 'lodash.sortby';

import FarmhandContext from '../../Farmhand.context';
import Item from '../Item';
import { itemsMap } from '../../data/maps';
import { getItemValue } from '../../utils';
import { enumify, itemType } from '../../enums';

import './Inventory.sass';

const { COW_FEED, CROP, FERTILIZER, SCARECROW, SPRINKLER } = itemType;

const sortItemIdsByTypeAndValue = memoize(itemIds =>
  sortBy(itemIds, [
    id => Number(itemsMap[id].type !== CROP),
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

export const categoryIds = enumify(['ANIMAL_SUPPLIES', 'FIELD_TOOLS', 'SEEDS']);
const categoryIdKeys = Object.keys(categoryIds);
const { ANIMAL_SUPPLIES, FIELD_TOOLS, SEEDS } = categoryIds;

const itemTypeCategoryMap = Object.freeze({
  [COW_FEED]: ANIMAL_SUPPLIES,
  [CROP]: SEEDS,
  [FERTILIZER]: FIELD_TOOLS,
  [SCARECROW]: FIELD_TOOLS,
  [SPRINKLER]: FIELD_TOOLS,
});

const getItemCategories = () =>
  categoryIdKeys.reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});

export const separateItemsIntoCategories = items =>
  sort(items).reduce((acc, item) => {
    acc[itemTypeCategoryMap[itemsMap[item.id].type]].push(item);
    return acc;
  }, getItemCategories());

export const Inventory = ({
  items,
  playerInventory,
  shopInventory,
  valueAdjustments,

  // Infer the type of view this is by doing an identity check against
  // gameState arrays.
  isPurchaseView = items === shopInventory,
  isSellView = items === playerInventory,

  itemCategories = separateItemsIntoCategories(items),
}) => (
  <div className="Inventory">
    {[
      [SEEDS, 'Seeds'],
      [FIELD_TOOLS, 'Field Tools'],
      [ANIMAL_SUPPLIES, 'Animal Supplies'],
    ].map(([category, headerText]) =>
      itemCategories[category].length ? (
        <section key={category}>
          <h2>{headerText}</h2>
          <ul className="card-list">
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
      ) : null
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
