import React from 'react';
import Shop from './';
import Inventory from '../Inventory';
import { shallow } from 'enzyme';
import assert from 'assert';

let component;

const getShop = props => (
  <Shop
    {...{
      handlePurchaseItem: () => {},
      items: [],
      state: {
        money: 0,
        valueAdjustments: {},
      },
      ...props,
    }}
  />
);

beforeEach(() => {
  component = shallow(getShop());
});

it('renders shop inventory', () => {
  assert.equal(component.find(Inventory).length, 1);
});
