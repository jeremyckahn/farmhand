import * as items from './items';
import * as recipes from './recipes';

export const itemsMap = Object.keys(items).reduce((acc, itemName) => {
  const item = items[itemName];
  acc[item.id] = item;
  return acc;
}, {});

export const recipesMap = Object.keys(recipes).reduce((acc, recipeName) => {
  const recipe = recipes[recipeName];
  acc[recipe.id] = recipe;
  return acc;
}, {});

export const cropIdToTypeMap = {
  SAMPLE_CROP_TYPE_1: 'sample-crop-type-1',
};
