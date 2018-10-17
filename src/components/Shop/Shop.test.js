import React from 'react';
import Shop from './';
import Inventory from '../Inventory';
import { shallow } from 'enzyme';
import assert from 'assert';

let component;

const getShop = (props = {}) => (
  <Shop
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

beforeEach(() => {
  component = shallow(getShop());
});

it('renders shop inventory', () => {
  assert.equal(component.find(Inventory).length, 1);
});
