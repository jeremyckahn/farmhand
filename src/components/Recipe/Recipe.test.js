import React from 'react';
import { shallow } from 'enzyme';

import Recipe, { canMakeRecipe } from './Recipe';

let component;

beforeEach(() => {
  component = shallow(
    <Recipe
      {...{
        recipe: {},
        inventory: [],
      }}
    />
  );
});

test('renders', () => {
  expect(component).toHaveLength(1);
});

describe('canMakeRecipe', () => {
  describe('player does not have sufficient ingredients', () => {
    test('evaluates inventory correctly', () => {
      expect(
        canMakeRecipe({ ingredients: { 'sample-item-1': 2 } }, [
          { id: 'sample-item-1', quantity: 1 },
        ])
      ).toBe(false);
    });
  });

  describe('player does have sufficient ingredients', () => {
    test('evaluates inventory correctly', () => {
      expect(
        canMakeRecipe({ ingredients: { 'sample-item-1': 2 } }, [
          { id: 'sample-item-1', quantity: 2 },
        ])
      ).toBe(true);
    });
  });
});
