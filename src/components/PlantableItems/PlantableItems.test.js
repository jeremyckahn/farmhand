import React from 'react';
import PlantableItems from './PlantableItems';
import Item from '../Item';
import { shallow } from 'enzyme';

jest.mock('../../data/maps');
jest.mock('../../data/items');

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
          plantableInventory: [{ quantity: 1, id: 'sample-crop-3' }],
          selectedPlantableItemId: 'sample-crop-3',
        },
      })
    );
  });

  it('renders items for provided inventory', () => {
    expect(component.find(Item)).toHaveLength(1);
  });

  it('renders selected item state', () => {
    expect(component.find(Item).props().isSelected).toBeTruthy();
  });
});
