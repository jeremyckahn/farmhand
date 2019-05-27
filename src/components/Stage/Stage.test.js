import React from 'react';
import { shallow } from 'enzyme';

import Field from '../Field';
import Inventory from '../Inventory';
import Shop from '../Shop';
import { stageFocusType } from '../../../src/enums';

import { Stage } from './Stage';

let component;

beforeEach(() => {
  component = shallow(
    <Stage
      {...{
        field: [[]],
        handleClickEndDayButton: () => {},
        isMenuOpen: true,
        playerInventory: [],
        stageFocus: stageFocusType.FIELD,
      }}
    />
  );
});

describe('focus', () => {
  describe('field', () => {
    beforeEach(() => {
      component.setProps({ gameState: { stageFocus: stageFocusType.FIELD } });
    });

    test('shows the field', () => {
      expect(component.find(Field)).toHaveLength(1);
    });
  });

  describe('inventory', () => {
    beforeEach(() => {
      component.setProps({ stageFocus: stageFocusType.INVENTORY });
    });

    test('shows the inventory', () => {
      expect(component.find(Inventory)).toHaveLength(1);
    });
  });

  describe('shop', () => {
    beforeEach(() => {
      component.setProps({ stageFocus: stageFocusType.SHOP });
    });

    test('shows the shop', () => {
      expect(component.find(Shop)).toHaveLength(1);
    });
  });
});
