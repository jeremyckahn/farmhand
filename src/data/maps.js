import * as items from '../data/items';
import { cropType } from '../enums';

const { CARROT, PUMPKIN } = cropType;

export const itemsMap = Object.keys(items).reduce((acc, itemName) => {
  const item = items[itemName];
  acc[item.id] = item;
  return acc;
}, {});

export const cropIdToTypeMap = {
  [CARROT]: 'carrot',
  [PUMPKIN]: 'pumpkin',
};
