import React from 'react';
import Inventory from '../../src/components/inventory';
import Item from '../../src/components/item';
import { shallow } from 'enzyme';
import assert from 'assert';

let component;

describe('inventory', () => {
  const getInventory = props => (
    <Inventory {...Object.assign({ items: [] }, props)} />
  );

  describe('rendering items', () => {
    beforeEach(() => {
      component = shallow(getInventory({ items: [{ name: 'some-item' }] }));
    });

    it('shows the inventory', () => {
      const li = component.find('li');
      assert.equal(li.length, 1);
      assert.equal(li.find(Item).length, 1);
    });
  });
});
