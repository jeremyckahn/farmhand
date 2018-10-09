/* eslint-disable import/first */
jest.mock('../../data/maps');
jest.mock('../../data/items');

import React from 'react';
import PlantableItems from './PlantableItems';
import Item from '../Item';
import { shallow } from 'enzyme';
import assert from 'assert';

let component;

const getPlantableItems = props => (
  <PlantableItems
    {...{
      handleSelectPlantableItem: () => {},
      inventory: [],
      selectedPlantableItemId: '',
      ...props,
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
        inventory: [{ quantity: 1, id: 'sample-item-3' }],
        selectedPlantableItemId: 'sample-item-3',
      })
    );
  });

  it('renders items for provided inventory', () => {
    assert.equal(component.find(Item).length, 1);
  });

  it('renders selected item state', () => {
    assert(component.find(Item).props().isSelected);
  });
});
