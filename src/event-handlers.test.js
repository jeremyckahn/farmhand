/* eslint-disable import/first */
jest.mock('./data/items');

import React from 'react';
import App from './App';
import { stageFocusType } from './enums';
import { shallow } from 'enzyme';
import { testItem } from './test-utils';
import { getCropFromItemId } from './utils';

let component;

const handlers = () => component.instance().handlers;

beforeEach(() => {
  component = shallow(<App />);
});

describe('handlePurchaseItem', () => {
  describe('user has enough money', () => {
    it('creates a new item in the inventory', () => {
      handlers().handlePurchaseItem(testItem({ id: 'sample-item-1' }));
      expect(component.state().inventory).toEqual([
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

        expect(component.state().inventory).toEqual([
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
        expect(component.state('money')).toEqual(90);
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
      expect(component.state('inventory')).toEqual([]);
    });

    it('does not deduct item value from money', () => {
      expect(component.state('money')).toEqual(5);
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
      expect(component.state().inventory).toEqual([]);
    });

    it('adds value of item to player money', () => {
      expect(component.state().money).toEqual(120);
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
      expect(component.state().inventory).toEqual([
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
    expect(component.state('stageFocus')).toEqual(stageFocusType.SHOP);
  });
});

describe('handleSelectPlantableItem', () => {
  beforeEach(() => {
    handlers().handleSelectPlantableItem(testItem({ id: 'sample-item-3' }));
  });

  it('updates selectedPlantableItemId state', () => {
    expect(component.state().selectedPlantableItemId).toEqual('sample-item-3');
  });
});

describe('handlePlotClick', () => {
  beforeEach(() => {
    component.setState({
      selectedPlantableItemId: 'sample-item-3',
    });
  });

  describe('item quantity > 1 (general logic)', () => {
    describe('plot is empty', () => {
      beforeEach(() => {
        component.setState({
          inventory: [testItem({ id: 'sample-item-3', quantity: 2 })],
        });

        handlers().handlePlotClick(0, 0);
      });

      it('plants the item', () => {
        expect(component.state().field[0][0]).toEqual(
          getCropFromItemId('sample-item-3')
        );
      });

      it('decrements item quantity', () => {
        expect(component.state().inventory[0].quantity).toEqual(1);
      });
    });

    describe('plot is not empty', () => {
      beforeEach(() => {
        component.setState({
          field: [[getCropFromItemId('sample-item-3')]],
          inventory: [testItem({ id: 'sample-item-3', quantity: 2 })],
        });

        handlers().handlePlotClick(0, 0);
      });

      it('does not decrement item quantity', () => {
        expect(component.state().inventory[0].quantity).toEqual(2);
      });
    });
  });

  describe('item quantity === 1', () => {
    beforeEach(() => {
      component.setState({
        inventory: [testItem({ id: 'sample-item-3', quantity: 1 })],
      });

      handlers().handlePlotClick(0, 0);
    });

    it('resets selectedPlantableItemId state', () => {
      expect(component.state().selectedPlantableItemId).toEqual('');
    });
  });
});
