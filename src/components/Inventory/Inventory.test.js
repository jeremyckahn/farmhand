import React from 'react';
import Item from '../Item';
import { shallow } from 'enzyme';
import { testItem } from '../../test-utils';
import { Inventory } from './Inventory';

jest.mock('../../data/maps');
jest.mock('../../data/items');

let component;

const getInventory = (props = {}) => (
  <Inventory
    {...{
      handlers: { ...props.handlers },
      items: [],
      gameState: {
        valueAdjustments: {},
        ...props.gameState,
      },
      ...props.options,
    }}
  />
);

describe('rendering items', () => {
  beforeEach(() => {
    component = shallow(
      getInventory({ options: { items: [testItem({ id: 'sample-item-1' })] } })
    );
  });

  test('shows the inventory', () => {
    const li = component.find('li');
    expect(li).toHaveLength(1);
    expect(li.find(Item)).toHaveLength(1);
  });
});
