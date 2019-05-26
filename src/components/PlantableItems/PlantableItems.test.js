import React from 'react';
import { shallow } from 'enzyme';

import Item from '../Item';

import { PlantableItems } from './PlantableItems';

jest.mock('../../data/maps');
jest.mock('../../data/items');

let component;

beforeEach(() => {
  component = shallow(
    <PlantableItems
      {...{
        handleItemSelect: () => {},
        plantableCropInventory: [],
        selectedItemId: '',
      }}
    />
  );
});

describe('rendering', () => {
  beforeEach(() => {
    component.setProps({
      plantableCropInventory: [{ quantity: 1, id: 'sample-crop-3' }],
      selectedItemId: 'sample-crop-3',
    });
  });

  test('renders items for provided inventory', () => {
    expect(component.find(Item)).toHaveLength(1);
  });

  test('renders selected item gameState', () => {
    expect(component.find(Item).props().isSelected).toBeTruthy();
  });
});
