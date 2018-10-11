/* eslint-disable import/first */
jest.mock('./data/items');

import React from 'react';
import Farmhand from './components/Farmhand';
import { stageFocusType } from './enums';
import { shallow } from 'enzyme';
import assert from 'assert';
import { testItem } from './test-utils';

let component;

const handlers = () => component.instance().handlers;

beforeEach(() => {
  component = shallow(<Farmhand />);
});

describe('handlePurchaseItem', () => {
  describe('user has enough money', () => {
    it('creates a new item in the inventory', () => {
      handlers().handlePurchaseItem(testItem({ id: 'sample-item-1' }));
      assert.deepEqual(component.state().inventory, [
        { id: 'sample-item-1', quantity: 1 },
      ]);
    });

    describe('existing items', () => {
      beforeEach(() => {
        component.setState({
          inventory: [testItem({ id: 'sample-item-1', quantity: 1 })],
        });
      });

      it('increments an existing item in the inventory', () => {
        handlers().handlePurchaseItem(testItem({ id: 'sample-item-1' }));

        assert.deepEqual(component.state().inventory, [
          testItem({
            id: 'sample-item-1',
            quantity: 2,
          }),
        ]);
      });
    });

    describe('money state', () => {
      beforeEach(() => {
        component.setState({ money: 100 });
        handlers().handlePurchaseItem(
          testItem({ id: 'sample-item-1', value: 10 })
        );
      });

      it('deducts item value from money', () => {
        assert.equal(component.state('money'), 90);
      });
    });
  });

  describe('user does not have enough money', () => {
    beforeEach(() => {
      component.setState({ money: 5 });
      handlers().handlePurchaseItem(
        testItem({ id: 'expensive-item', value: 10 })
      );
    });

    it('does not add the item to the inventory', () => {
      assert.deepEqual(component.state('inventory'), {});
    });

    it('does not deduct item value from money', () => {
      assert.equal(component.state('money'), 5);
    });
  });
});

describe('handleSellItem', () => {
  describe('single instance of item in inventory', () => {
    beforeEach(() => {
      component.setState({
        inventory: [testItem({ id: 'sample-item-1', quantity: 1 })],
        money: 100,
      });

      handlers().handleSellItem(testItem({ id: 'sample-item-1', value: 20 }));
    });

    it('removes item from inventory', () => {
      assert.deepEqual(component.state().inventory, []);
    });

    it('adds value of item to player money', () => {
      assert.equal(component.state().money, 120);
    });
  });

  describe('multiple instances of item in inventory', () => {
    beforeEach(() => {
      component.setState({
        inventory: [testItem({ id: 'sample-item-1', quantity: 2 })],
      });

      handlers().handleSellItem(testItem({ id: 'sample-item-1', value: 20 }));
    });

    it('decrements item', () => {
      assert.deepEqual(component.state().inventory, [
        testItem({
          id: 'sample-item-1',
          quantity: 1,
        }),
      ]);
    });
  });
});

describe('handleChangeView', () => {
  beforeEach(() => {
    handlers().handleChangeView({ target: { value: stageFocusType.SHOP } });
  });

  it('changes the view type', () => {
    assert.equal(component.state('stageFocus'), stageFocusType.SHOP);
  });
});

describe('handleSelectPlantableItem', () => {
  beforeEach(() => {
    handlers().handleSelectPlantableItem(testItem({ id: 'sample-item-3' }));
  });

  it('updates selectedPlantableItemId state', () => {
    assert.equal(component.state().selectedPlantableItemId, 'sample-item-3');
  });
});

describe('handlePlotClick', () => {
  beforeEach(() => {
    component.setState({
      selectedPlantableItemId: 'sample-item-3',
    });
  });

  describe('item quantity > 1 (general logic)', () => {
    beforeEach(() => {
      component.setState({
        inventory: [testItem({ id: 'sample-item-3', quantity: 2 })],
      });

      handlers().handlePlotClick(0, 0);
    });

    xit('plants the item', () => {});

    xit('decrements item quantity', () => {});
  });

  describe('item quantity === 1', () => {
    beforeEach(() => {
      component.setState({
        inventory: [testItem({ id: 'sample-item-3', quantity: 1 })],
      });

      handlers().handlePlotClick(0, 0);
    });

    xit('resets selectedPlantableItemId state', () => {});
  });
});
