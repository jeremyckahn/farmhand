/* eslint-disable import/first */
jest.mock('./data/items');

import React from 'react';
import App from './App';
import { stageFocusType, toolType } from './enums';
import { shallow } from 'enzyme';
import { testItem } from './test-utils';
import { getCropFromItemId } from './utils';

let component;

const handlers = () => component.instance().handlers;

beforeEach(() => {
  component = shallow(<App />);
});

describe('handleItemPurchase', () => {
  describe('user has enough money', () => {
    it('creates a new item in the inventory', () => {
      handlers().handleItemPurchase(testItem({ id: 'sample-item-1' }));
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
        handlers().handleItemPurchase(testItem({ id: 'sample-item-1' }));

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
        handlers().handleItemPurchase(
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
      handlers().handleItemPurchase(
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

describe('handleItemSell', () => {
  describe('single instance of item in inventory', () => {
    beforeEach(() => {
      component.setState({
        inventory: [testItem({ id: 'sample-item-1', quantity: 1 })],
        money: 100,
      });

      handlers().handleItemSell(testItem({ id: 'sample-item-1', value: 20 }));
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

      handlers().handleItemSell(testItem({ id: 'sample-item-1', value: 20 }));
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

describe('handleViewChange', () => {
  beforeEach(() => {
    handlers().handleViewChange({ target: { value: stageFocusType.SHOP } });
  });

  it('changes the view type', () => {
    expect(component.state('stageFocus')).toEqual(stageFocusType.SHOP);
  });
});

describe('handlePlantableItemSelect', () => {
  beforeEach(() => {
    component.setState({
      selectedTool: toolType.WATERING_CAN,
    });

    handlers().handlePlantableItemSelect(testItem({ id: 'sample-item-3' }));
  });

  it('updates selectedPlantableItemId state', () => {
    expect(component.state().selectedPlantableItemId).toEqual('sample-item-3');
  });

  it('resets state.selectedTool', () => {
    expect(component.state().selectedTool).toEqual(toolType.NONE);
  });
});

describe('handleToolSelect', () => {
  beforeEach(() => {
    component.setState({
      selectedPlantableItemId: 'sample-item-3',
    });

    handlers().handleToolSelect(toolType.WATERING_CAN);
  });

  it('updates selectedTool state', () => {
    expect(component.state().selectedTool).toEqual(toolType.WATERING_CAN);
  });

  it('resets state.selectedPlantableItemId', () => {
    expect(component.state().selectedPlantableItemId).toEqual('');
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

describe('handleEndDayButtonClick', () => {
  it('increments the day', () => {
    const incrementDaySpy = jest.spyOn(component.instance(), 'incrementDay');
    handlers().handleEndDayButtonClick();
    expect(incrementDaySpy.mock.calls.length).toBe(1);
  });
});
