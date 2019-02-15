import React from 'react';
import { shallow } from 'enzyme';
import localforage from 'localforage';
import { getCropFromItemId } from './utils';
import { testCrop, testItem } from './test-utils';
import { INITIAL_FIELD_WIDTH, INITIAL_FIELD_HEIGHT } from './constants';
import { PROGRESS_SAVED_MESSAGE } from './strings';
import { fieldMode } from './enums';

import Farmhand from './Farmhand';

jest.mock('localforage');
jest.mock('./data/maps');
jest.mock('./data/items');

jest.mock('./constants', () => ({
  FERTILIZER_BONUS: 0.5,
  FERTILIZER_ITEM_ID: 'fertilizer',
  INITIAL_FIELD_WIDTH: 4,
  INITIAL_FIELD_HEIGHT: 4,
  RAIN_CHANCE: 0,
}));

let component;

beforeEach(() => {
  localforage.createInstance = () => ({
    getItem: () => Promise.resolve(null),
    setItem: data => Promise.resolve(data),
  });

  component = shallow(<Farmhand />);
});

describe('state', () => {
  it('inits field', () => {
    expect(component.state().field).toHaveLength(INITIAL_FIELD_HEIGHT);
    expect(component.state().field[0]).toHaveLength(INITIAL_FIELD_WIDTH);
  });
});

describe('instance methods', () => {
  describe('componentDidMount', () => {
    beforeEach(() => {
      jest.spyOn(component.instance(), 'incrementDay');
    });

    describe('fresh boot', () => {
      beforeEach(() => {
        component.instance().componentDidMount();
      });

      it('increments the day by one', () => {
        expect(component.instance().incrementDay).toHaveBeenCalled();
      });
    });

    describe('boot from persisted state', () => {
      beforeEach(() => {
        localforage.createInstance = () => ({
          getItem: () =>
            Promise.resolve({
              foo: 'bar',
              newDayNotifications: [{ message: 'baz' }],
            }),
          setItem: data => Promise.resolve(data),
        });

        component = shallow(<Farmhand />);

        jest.spyOn(component.instance(), 'incrementDay');
        jest.spyOn(component.instance(), 'showNotification');

        component.instance().componentDidMount();
      });

      it('rehydrates from persisted state', () => {
        expect(component.instance().incrementDay).not.toHaveBeenCalled();
        expect(component.state().foo).toBe('bar');
      });

      it('shows notifications for pending newDayNotifications', () => {
        expect(component.instance().showNotification).toHaveBeenCalledWith({
          message: 'baz',
        });
      });

      it('empties newDayNotifications', () => {
        expect(component.state().newDayNotifications).toHaveLength(0);
      });
    });
  });

  describe('incrementDay', () => {
    beforeEach(() => {
      jest.spyOn(component.instance().localforage, 'setItem');
      jest.spyOn(component.instance(), 'showNotification');

      component.setState({ newDayNotifications: [{ message: 'foo' }] });
      component.instance().incrementDay();
    });

    it('empties out newDayNotifications', () => {
      expect(component.state().newDayNotifications).toHaveLength(0);
    });

    it('persists app state with pending newDayNotifications', () => {
      expect(component.instance().localforage.setItem).toHaveBeenCalledWith(
        'state',
        {
          ...component.state(),
          newDayNotifications: [{ message: 'foo' }],
        }
      );
    });

    it('makes pending notification', () => {
      const { showNotification } = component.instance();
      expect(showNotification).toHaveBeenCalledTimes(2);
      expect(showNotification).toHaveBeenNthCalledWith(1, {
        level: 'success',
        message: PROGRESS_SAVED_MESSAGE,
      });
      expect(showNotification).toHaveBeenNthCalledWith(2, {
        message: 'foo',
      });
    });
  });

  describe('purchaseItem', () => {
    describe('user has enough money', () => {
      describe('money state', () => {
        beforeEach(() => {
          component.setState({ money: 100 });
          component
            .instance()
            .purchaseItem(testItem({ id: 'sample-item-1', value: 10 }));
        });

        it('deducts item value from money', () => {
          expect(component.state('money')).toEqual(90);
        });
      });
    });

    describe('user does not have enough money', () => {
      beforeEach(() => {
        component.setState({ money: 5 });
        component
          .instance()
          .purchaseItem(testItem({ id: 'expensive-item', value: 10 }));
      });

      it('does not add the item to the inventory', () => {
        expect(component.state('inventory')).toEqual([]);
      });

      it('does not deduct item value from money', () => {
        expect(component.state('money')).toEqual(5);
      });
    });
  });

  describe('sellItem', () => {
    beforeEach(() => {
      component.setState({
        inventory: [testItem({ id: 'sample-item-1', quantity: 1 })],
        money: 100,
      });

      component
        .instance()
        .sellItem(testItem({ id: 'sample-item-1', value: 20 }));
    });

    it('decrements item from inventory', () => {
      expect(component.state().inventory).toEqual([]);
    });

    it('adds value of item to player money', () => {
      expect(component.state().money).toEqual(120);
    });
  });

  describe('plantInPlot', () => {
    beforeEach(() => {
      component.setState({
        selectedItemId: 'sample-crop-seeds-1',
      });
    });

    describe('crop quantity > 1', () => {
      describe('plot is empty', () => {
        beforeEach(() => {
          component.setState({
            inventory: [testItem({ id: 'sample-crop-seeds-1', quantity: 2 })],
          });

          component.instance().plantInPlot(0, 0, 'sample-crop-seeds-1');
        });

        it('plants the crop', () => {
          expect(component.state().field[0][0]).toEqual(
            getCropFromItemId('sample-crop-1')
          );
        });

        it('decrements crop quantity', () => {
          expect(component.state().inventory[0].quantity).toEqual(1);
        });
      });

      describe('plot is not empty', () => {
        beforeEach(() => {
          component.setState({
            field: [[getCropFromItemId('sample-crop-seeds-1')]],
            inventory: [testItem({ id: 'sample-crop-seeds-1', quantity: 2 })],
          });

          component.instance().plantInPlot(0, 0, 'sample-crop-seeds-1');
        });

        it('does not decrement crop quantity', () => {
          expect(component.state().inventory[0].quantity).toEqual(2);
        });
      });
    });

    describe('crop quantity === 1', () => {
      beforeEach(() => {
        component.setState({
          inventory: [testItem({ id: 'sample-crop-seeds-1', quantity: 1 })],
        });

        component.instance().plantInPlot(0, 0, 'sample-crop-seeds-1');
      });

      it('resets selectedItemId state', () => {
        expect(component.state().selectedItemId).toEqual('');
      });
    });
  });

  describe('clearPlot', () => {
    beforeEach(() => {
      component.setState({
        field: [[testCrop({ itemId: 'sample-crop-1' })]],
      });

      component.instance().clearPlot(0, 0);
    });

    it('removes the crop from the plot', () => {
      expect(component.state().field[0][0]).toBe(null);
    });
  });

  describe('fertilizePlot', () => {
    describe('unfertilized crops', () => {
      describe('happy path', () => {
        beforeEach(() => {
          component.setState({
            field: [[testCrop({ itemId: 'sample-crop-1' })]],
            inventory: [testItem({ id: 'fertilizer', quantity: 1 })],
          });

          component.instance().fertilizePlot(0, 0);
        });

        it('fertilizes crop', () => {
          expect(component.state().field[0][0]).toEqual(
            testCrop({ itemId: 'sample-crop-1', isFertilized: true })
          );
        });

        it('decrements fertilizer from inventory', () => {
          expect(component.state().inventory).toEqual([]);
        });
      });

      describe('FERTILIZE field mode updating', () => {
        describe('multiple fertilizer units remaining', () => {
          beforeEach(() => {
            component.setState({
              field: [[testCrop({ itemId: 'sample-crop-1' })]],
              inventory: [testItem({ id: 'fertilizer', quantity: 2 })],
            });

            component.instance().fertilizePlot(0, 0);
          });

          it('does not change fieldMode', () => {
            expect(component.state().fieldMode).toBe(fieldMode.FERTILIZE);
          });

          it('does not change selectedItemId', () => {
            expect(component.state().selectedItemId).toBe('fertilizer');
          });
        });

        describe('one fertilizer unit remaining', () => {
          beforeEach(() => {
            component.setState({
              field: [[testCrop({ itemId: 'sample-crop-1' })]],
              inventory: [testItem({ id: 'fertilizer', quantity: 1 })],
            });

            component.instance().fertilizePlot(0, 0);
          });

          it('change fieldMode to OBSERVE', () => {
            expect(component.state().fieldMode).toBe(fieldMode.OBSERVE);
          });

          it('resets selectedItemId', () => {
            expect(component.state().selectedItemId).toBe('');
          });
        });
      });
    });
  });

  describe('harvestPlot', () => {
    describe('unripe crops', () => {
      beforeEach(() => {
        component.setState({
          field: [[testCrop({ itemId: 'sample-crop-1' })]],
        });

        component.instance().harvestPlot(0, 0);
      });

      it('does nothing', () => {
        expect(component.state().field[0][0]).toEqual(
          testCrop({ itemId: 'sample-crop-1' })
        );
      });
    });

    describe('ripe crops', () => {
      beforeEach(() => {
        component.setState({
          field: [[testCrop({ itemId: 'sample-crop-1', daysWatered: 4 })]],
        });

        component.instance().harvestPlot(0, 0);
      });

      it('removes the crop from the plot', () => {
        expect(component.state().field[0][0]).toBe(null);
      });

      it('adds crop to the inventory', () => {
        expect(component.state().inventory).toEqual([
          { id: 'sample-crop-1', quantity: 1 },
        ]);
      });
    });
  });

  describe('waterPlot', () => {
    beforeEach(() => {
      component.setState({
        field: [[testCrop({ itemId: 'sample-crop-1' })]],
      });

      component.instance().waterPlot(0, 0);
    });

    it('sets wasWateredToday to true', () => {
      expect(component.state().field[0][0].wasWateredToday).toBe(true);
    });
  });

  describe('waterAllPlots', () => {
    beforeEach(() => {
      component.setState({
        field: [
          [
            testCrop({ itemId: 'sample-crop-1' }),
            testCrop({ itemId: 'sample-crop-2' }),
          ],
          [testCrop({ itemId: 'sample-crop-3' })],
        ],
      });

      component.instance().waterAllPlots();
    });

    it('sets wasWateredToday to true for all plots', () => {
      expect(component.state().field[0][0].wasWateredToday).toBe(true);
      expect(component.state().field[0][1].wasWateredToday).toBe(true);
      expect(component.state().field[1][0].wasWateredToday).toBe(true);
    });
  });
});
