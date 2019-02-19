import React from 'react';
import Stage from './';
import Field from '../Field';
import Inventory from '../Inventory';
import Shop from '../Shop';
import { stageFocusType } from '../../../src/enums';
import { shallow } from 'enzyme';

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
        selectedItemId: '',
        fieldMode: '',
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

    test('shows the field', () => {
      expect(component.find(Field)).toHaveLength(1);
    });
  });

  describe('inventory', () => {
    beforeEach(() => {
      component = shallow(
        getStage({ state: { stageFocus: stageFocusType.INVENTORY } })
      );
    });

    test('shows the inventory', () => {
      expect(component.find(Inventory)).toHaveLength(1);
    });
  });

  describe('shop', () => {
    beforeEach(() => {
      component = shallow(
        getStage({ state: { stageFocus: stageFocusType.SHOP } })
      );
    });

    test('shows the shop', () => {
      expect(component.find(Shop)).toHaveLength(1);
    });
  });
});
