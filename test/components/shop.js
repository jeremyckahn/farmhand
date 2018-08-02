import React from 'react';
import Shop from '../../src/components/shop';
import Inventory from '../../src/components/inventory';
import { shallow } from 'enzyme';
import assert from 'assert';

let component;

describe('shop', () => {
  const getShop = props => (
    <Shop
      {...{
        handlePurchaseItem: () => {},
        items: [],
        money: 0,
        valueAdjustments: {},
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
});
