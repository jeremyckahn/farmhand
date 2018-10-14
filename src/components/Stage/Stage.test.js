import React from 'react';
import Stage from './';
import Field from '../Field';
import Inventory from '../Inventory';
import Shop from '../Shop';
import { stageFocusType } from '../../../src/enums';
import { shallow } from 'enzyme';
import assert from 'assert';

let component;

const getStage = props => (
  <Stage
    {...{
      handlePlotClick: () => {},
      handlePurchaseItem: () => {},
      handleSellItem: () => {},
      playerInventory: [],
      stageFocus: stageFocusType.FIELD,
      state: {
        fieldHeight: 4,
        fieldWidth: 2,
        money: 0,
        selectedPlantableItemId: '',
        shopInventory: [],
        valueAdjustments: {},
      },
      ...props,
    }}
  />
);

describe('focus', () => {
  describe('field', () => {
    beforeEach(() => {
      component = shallow(getStage({ stageFocus: stageFocusType.FIELD }));
    });

    it('shows the field', () => {
      assert.equal(component.find(Field).length, 1);
    });
  });

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
