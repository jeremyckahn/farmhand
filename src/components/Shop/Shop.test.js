import React from 'react';
import Shop from './';
import Inventory from '../Inventory';
import { shallow } from 'enzyme';

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

test('renders shop inventory', () => {
  expect(component.find(Inventory)).toHaveLength(1);
});
