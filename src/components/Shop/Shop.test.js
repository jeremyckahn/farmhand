import React from 'react';
import { shallow } from 'enzyme';

import Inventory from '../Inventory';

import { Shop } from './Shop';

let component;

beforeEach(() => {
  component = shallow(
    <Shop
      {...{
        shopInventory: [],
        money: 0,
        valueAdjustments: {},
      }}
    />
  );
});

test('renders shop inventory', () => {
  expect(component.find(Inventory)).toHaveLength(1);
});
