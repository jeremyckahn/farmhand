import React from 'react';
import Farmhand from '../src/components/farmhand';
import { shallow } from 'enzyme';
import assert from 'assert';

let component;

describe('event handlers', () => {
  beforeEach(() => {
    component = shallow(<Farmhand />);
  });

  describe('handlePurchaseItem', () => {
    it('creates a new item in the inventory', () => {
      component.instance().handlePurchaseItem({ name: 'some-item' });
      assert.deepEqual(component.state().inventory, { 'some-item': 1 });
    });

    describe('existing items', () => {
      beforeEach(() => {
        component.setState({ inventory: { 'some-item': 1 } });
      });

      it('increments an existing item in the inventory', () => {
        component.instance().handlePurchaseItem({ name: 'some-item' });
        assert.deepEqual(component.state().inventory, { 'some-item': 2 });
      });
    });
  });
});
