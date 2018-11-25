/* eslint-disable import/first */
jest.mock('../../data/maps');
jest.mock('../../data/items');

import React from 'react';
import PlantableItems from './PlantableItems';
import Item from '../Item';
import { shallow } from 'enzyme';

let component;

const getPlantableItems = (props = {}) => (
  <PlantableItems
    {...{
      handlers: {
        handlePlantableItemSelect: () => {},
        ...props.handlers,
      },
      state: {
        plantableInventory: [],
        selectedPlantableItemId: '',
        ...props.state,
      },
    }}
  />
);

beforeEach(() => {
  component = shallow(getPlantableItems());
});

describe('rendering', () => {
  beforeEach(() => {
    component = shallow(
      getPlantableItems({
        state: {
          plantableInventory: [{ quantity: 1, id: 'sample-item-3' }],
          selectedPlantableItemId: 'sample-item-3',
        },
      })
    );
  });

  it('renders items for provided inventory', () => {
    expect(component.find(Item).length).toEqual(1);
  });

  it('renders selected item state', () => {
    expect(component.find(Item).props().isSelected).toBeTruthy();
  });
});
