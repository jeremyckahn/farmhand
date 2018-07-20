import React from 'react';
import Stage from '../../src/components/stage';
import Inventory from '../../src/components/inventory';
import Shop from '../../src/components/shop';
import { stageFocus } from '../../src/enums';
import { shallow } from 'enzyme';
import assert from 'assert';

let component;

describe('stage', () => {
  const getStage = props => (
    <Stage {...Object.assign({ focusType: stageFocus.NONE }, props)} />
  );

  describe('focus', () => {
    describe('inventory', () => {
      beforeEach(() => {
        component = shallow(getStage({ focusType: stageFocus.INVENTORY }));
      });

      it('shows the inventory', () => {
        assert.equal(component.find(Inventory).length, 1);
      });
    });

    describe('shop', () => {
      beforeEach(() => {
        component = shallow(getStage({ focusType: stageFocus.SHOP }));
      });

      it('shows the shop', () => {
        assert.equal(component.find(Shop).length, 1);
      });
    });
  });
});
