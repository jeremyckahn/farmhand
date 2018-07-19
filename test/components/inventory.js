import React from 'react';
import Inventory from '../../src/components/inventory';
import { shallow } from 'enzyme';
import assert from 'assert';

let component;

describe('inventory', () => {
  const getInventory = props => (
    <Inventory {...Object.assign({ items: [] }, props)} />
  );

  describe('rendering items', () => {
    beforeEach(() => {
      component = shallow(getInventory({ items: [{}] }));
    });

    it('shows the inventory', () => {
      assert.equal(component.find('li').length, 1);
    });
  });
});
