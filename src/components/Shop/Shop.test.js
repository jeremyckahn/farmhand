import React from 'react';
import { Shop } from './Shop';
import Inventory from '../Inventory';
import { shallow } from 'enzyme';

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
