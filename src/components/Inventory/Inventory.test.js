/* eslint-disable import/first */
jest.mock('../../data/maps');
jest.mock('../../data/items');

import React from 'react';
import Item from '../Item';
import { shallow } from 'enzyme';
import { testItem } from '../../test-utils';
import Inventory from './Inventory';

let component;

const getInventory = (props = {}) => (
  <Inventory
    {...{
      handlers: { ...props.handlers },
      items: [],
      state: {
        valueAdjustments: {},
        ...props.state,
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

  it('shows the inventory', () => {
    const li = component.find('li');
    expect(li.length).toEqual(1);
    expect(li.find(Item).length).toEqual(1);
  });
});
