import React from 'react';
import proxyquire from 'proxyquire';
import Item from '../../src/components/item';
import { shallow } from 'enzyme';
import assert from 'assert';
import { testItem } from '../test-utils';
import { itemsMap } from '../fixtures/items';

const { getItemValue } = proxyquire('../../src/utils', {
  './data/maps': {
    itemsMap,
  },
});

const { default: Inventory } = proxyquire('../../src/components/inventory', {
  '../utils': {
    getItemValue,
  },
});

let component;

describe('inventory', () => {
  const getInventory = props => (
    <Inventory {...{ items: [], money: 0, valueAdjustments: {}, ...props }} />
  );

  describe('rendering items', () => {
    beforeEach(() => {
      component = shallow(
        getInventory({ items: [testItem({ id: 'sample-item-1' })] })
      );
    });

    it('shows the inventory', () => {
      const li = component.find('li');
      assert.equal(li.length, 1);
      assert.equal(li.find(Item).length, 1);
    });
  });
});
