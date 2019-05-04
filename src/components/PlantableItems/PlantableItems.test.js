import React from 'react';
import { PlantableItems } from './PlantableItems';
import Item from '../Item';
import { shallow } from 'enzyme';

jest.mock('../../data/maps');
jest.mock('../../data/items');

let component;

beforeEach(() => {
  component = shallow(
    <PlantableItems
      {...{
        handleItemSelect: () => {},
        plantableInventory: [],
        selectedItemId: '',
      }}
    />
  );
});

describe('rendering', () => {
  beforeEach(() => {
    component.setProps({
      plantableInventory: [{ quantity: 1, id: 'sample-crop-3' }],
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
