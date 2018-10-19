import React from 'react';
import Stage from './';
import Field from '../Field';
import Inventory from '../Inventory';
import Shop from '../Shop';
import { stageFocusType } from '../../../src/enums';
import { shallow } from 'enzyme';
import assert from 'assert';

let component;

const getStage = (props = {}) => (
  <Stage
    {...{
      handlers: {
        ...props.handlers,
      },
      state: {
        field: [],
        fieldHeight: 4,
        fieldWidth: 2,
        playerInventory: [],
        selectedPlantableItemId: '',
        shopInventory: [],
        stageFocus: stageFocusType.FIELD,
        valueAdjustments: {},
        ...props.state,
      },
    }}
  />
);

describe('focus', () => {
  describe('field', () => {
    beforeEach(() => {
      component = shallow(
        getStage({ state: { stageFocus: stageFocusType.FIELD } })
      );
    });

    it('shows the field', () => {
      assert.equal(component.find(Field).length, 1);
    });
  });

  describe('inventory', () => {
    beforeEach(() => {
      component = shallow(
        getStage({ state: { stageFocus: stageFocusType.INVENTORY } })
      );
    });

    it('shows the inventory', () => {
      assert.equal(component.find(Inventory).length, 1);
    });
  });

  describe('shop', () => {
    beforeEach(() => {
      component = shallow(
        getStage({ state: { stageFocus: stageFocusType.SHOP } })
      );
    });

    it('shows the shop', () => {
      assert.equal(component.find(Shop).length, 1);
    });
  });
});
