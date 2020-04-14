import * as items from './items';

export const sampleRecipe1 = {
  id: 'sample-recipe-1',
  name: 'Sample Recipe 1',
  markup: 10,
  ingredients: {
    [items.sampleItem1.id]: 2,
  },
};
