import React from 'react';
import Stage from './';
import Inventory from '../Inventory';
import Shop from '../Shop';
import { stageFocusType } from '../../../src/enums';
import { shallow } from 'enzyme';
import assert from 'assert';

let component;

describe('stage', () => {
  const getStage = props => (
    <Stage
      {...{
        handlePurchaseItem: () => {},
        handleSellItem: () => {},
        inventory: [],
        money: 0,
        shopInventory: [],
        stageFocus: stageFocusType.NONE,
        valueAdjustments: {},
        ...props,
      }}
    />
  );

  describe('focus', () => {
    describe('inventory', () => {
      beforeEach(() => {
        component = shallow(getStage({ stageFocus: stageFocusType.INVENTORY }));
      });

      it('shows the inventory', () => {
        assert.equal(component.find(Inventory).length, 1);
      });
    });

    describe('shop', () => {
      beforeEach(() => {
        component = shallow(getStage({ stageFocus: stageFocusType.SHOP }));
      });

      it('shows the shop', () => {
        assert.equal(component.find(Shop).length, 1);
      });
    });
  });
});
