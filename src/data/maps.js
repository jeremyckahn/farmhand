import * as items from '../data/items';

export const itemsMap = Object.keys(items).reduce((acc, itemName) => {
  const item = items[itemName];
  acc[item.id] = item;
  return acc;
}, {});
