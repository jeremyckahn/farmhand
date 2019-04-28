import React from 'react';
import { shallow } from 'enzyme';
import { getCropFromItemId, getPlotContentFromItemId } from './utils';
import { testCrop, testItem } from './test-utils';
import {
  FERTILIZER_ITEM_ID,
  INITIAL_FIELD_WIDTH,
  INITIAL_FIELD_HEIGHT,
  SCARECROW_ITEM_ID,
  SPRINKLER_ITEM_ID,
} from './constants';
import { PROGRESS_SAVED_MESSAGE } from './strings';
import { fieldMode } from './enums';

import Farmhand from './Farmhand';

jest.mock('localforage');
jest.mock('./data/maps');
jest.mock('./data/items');
jest.mock('./constants');

let component;

const stubLocalforage = () => {
  const localforage = jest.requireMock('localforage');
  localforage.createInstance = () => ({
    getItem: () => Promise.resolve(null),
    setItem: data => Promise.resolve(data),
  });
};

beforeEach(() => {
  stubLocalforage();
  component = shallow(<Farmhand />);
});

describe('state', () => {
  test('inits field', () => {
    expect(component.state().field).toHaveLength(INITIAL_FIELD_HEIGHT);
    expect(component.state().field[0]).toHaveLength(INITIAL_FIELD_WIDTH);
  });
});

describe('getters', () => {
  describe('hoveredPlotRange', () => {
    beforeEach(() => {
      component.setState({
        hoveredPlot: { x: 0, y: 0 },
      });
    });

    describe('fieldMode === SET_SPRINKLER', () => {
      beforeEach(() => {
        component.setState({
          fieldMode: fieldMode.SET_SPRINKLER,
          hoveredPlotRangeSize: 1,
        });
      });

      describe('plot is empty', () => {
        beforeEach(() => {
          component.setState({
            field: [[null]],
          });
        });

        test('gets hovered crop range', () => {
          const { hoveredPlotRange } = component.instance();
          expect(hoveredPlotRange).toEqual([
            [{ x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 }],
            [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }],
            [{ x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
          ]);
        });
      });

      describe('plot is not empty', () => {
        beforeEach(() => {
          component.setState({
            field: [[testCrop()]],
          });
        });

        test('gets only the hovered crop', () => {
          const { hoveredPlotRange } = component.instance();
          expect(hoveredPlotRange).toEqual([[{ x: 0, y: 0 }]]);
        });
      });
    });

    describe('fieldMode !== SET_SPRINKLER', () => {
      test('gets only the hovered crop', () => {
        const { hoveredPlotRange } = component.instance();
        expect(hoveredPlotRange).toEqual([[{ x: 0, y: 0 }]]);
      });
    });
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

      test('increments the day by one', () => {
        expect(component.instance().incrementDay).toHaveBeenCalled();
      });
    });

    describe('boot from persisted state', () => {
      beforeEach(() => {
        const localforage = jest.requireMock('localforage');
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

      test('rehydrates from persisted state', () => {
        expect(component.instance().incrementDay).not.toHaveBeenCalled();
        expect(component.state().foo).toBe('bar');
      });

      test('shows notifications for pending newDayNotifications', () => {
        expect(component.instance().showNotification).toHaveBeenCalledWith({
          message: 'baz',
        });
      });

      test('empties newDayNotifications', () => {
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

    test('empties out newDayNotifications', () => {
      expect(component.state().newDayNotifications).toHaveLength(0);
    });

    test('persists app state with pending newDayNotifications', () => {
      expect(component.instance().localforage.setItem).toHaveBeenCalledWith(
        'state',
        {
          ...component.state(),
          newDayNotifications: [{ message: 'foo' }],
        }
      );
    });

    test('makes pending notification', () => {
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

        test('deducts item value from money', () => {
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

      test('does not add the item to the inventory', () => {
        expect(component.state('inventory')).toEqual([]);
      });

      test('does not deduct item value from money', () => {
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

    test('decrements item from inventory', () => {
      expect(component.state().inventory).toEqual([]);
    });

    test('adds value of item to player money', () => {
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

        test('plants the crop', () => {
          expect(component.state().field[0][0]).toEqual(
            getCropFromItemId('sample-crop-1')
          );
        });

        test('decrements crop quantity', () => {
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

        test('does not decrement crop quantity', () => {
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

      test('resets selectedItemId state', () => {
        expect(component.state().selectedItemId).toEqual('');
      });
    });
  });

  describe('clearPlot', () => {
    describe('plotContent is a crop', () => {
      beforeEach(() => {
        component.setState({
          field: [[testCrop({ itemId: 'sample-crop-1' })]],
        });

        component.instance().clearPlot(0, 0);
      });

      test('clears the plot', () => {
        expect(component.state().field[0][0]).toBe(null);
      });
    });

    describe('plotContent is a sprinkler', () => {
      beforeEach(() => {
        component.setState({
          field: [[getPlotContentFromItemId('sprinkler')]],
        });

        component.instance().clearPlot(0, 0);
      });

      test('adds sprinkler to inventory', () => {
        expect(component.state().inventory).toEqual([
          { id: 'sprinkler', quantity: 1 },
        ]);
      });

      test('clears the plot', () => {
        expect(component.state().field[0][0]).toBe(null);
      });
    });
  });

  describe('fertilizeCrop', () => {
    describe('non-crop plotContent', () => {
      test('no-ops', () => {
        component.setState({
          field: [[getPlotContentFromItemId('sprinkler')]],
        });
        const oldState = component.state();
        component.instance().fertilizeCrop(0, 0);
        const newState = component.state();
        expect(newState).toEqual(oldState);
      });
    });

    describe('unfertilized crops', () => {
      describe('happy path', () => {
        beforeEach(() => {
          component.setState({
            field: [[testCrop({ itemId: 'sample-crop-1' })]],
            inventory: [testItem({ id: 'fertilizer', quantity: 1 })],
            selectedItemId: FERTILIZER_ITEM_ID,
          });

          component.instance().fertilizeCrop(0, 0);
        });

        test('fertilizes crop', () => {
          expect(component.state().field[0][0]).toEqual(
            testCrop({ itemId: 'sample-crop-1', isFertilized: true })
          );
        });

        test('decrements fertilizer from inventory', () => {
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

            component.instance().fertilizeCrop(0, 0);
          });

          test('does not change fieldMode', () => {
            expect(component.state().fieldMode).toBe(fieldMode.FERTILIZE);
          });

          test('does not change selectedItemId', () => {
            expect(component.state().selectedItemId).toBe('fertilizer');
          });
        });

        describe('one fertilizer unit remaining', () => {
          beforeEach(() => {
            component.setState({
              field: [[testCrop({ itemId: 'sample-crop-1' })]],
              inventory: [testItem({ id: 'fertilizer', quantity: 1 })],
            });

            component.instance().fertilizeCrop(0, 0);
          });

          test('changes fieldMode to OBSERVE', () => {
            expect(component.state().fieldMode).toBe(fieldMode.OBSERVE);
          });

          test('resets selectedItemId', () => {
            expect(component.state().selectedItemId).toBe('');
          });
        });
      });
    });
  });

  describe('setSprinkler', () => {
    beforeEach(() => {
      component.setState({
        field: [[null]],
        fieldMode: fieldMode.SET_SPRINKLER,
        hoveredPlot: { x: 0, y: 0 },
        hoveredPlotRangeSize: 1,
        inventory: [testItem({ id: 'sprinkler', quantity: 1 })],
        selectedItemId: SPRINKLER_ITEM_ID,
      });
    });

    describe('plot is not empty', () => {
      test('does nothing', () => {
        component.setState({ field: [[testCrop()]] });
        const beforeState = component.state();
        component.instance().setSprinkler(0, 0);
        const afterState = component.state();
        expect(afterState).toEqual(beforeState);
      });
    });

    describe('plot is empty', () => {
      test('decrements sprinkler from inventory', () => {
        component.instance().setSprinkler(0, 0);
        expect(component.state().inventory).toHaveLength(0);
      });

      test('sets sprinkler', () => {
        component.instance().setSprinkler(0, 0);
        expect(component.state().field[0][0]).toEqual(
          getPlotContentFromItemId('sprinkler')
        );
      });

      describe('multiple sprinkler units remaining', () => {
        beforeEach(() => {
          component.setState({
            inventory: [testItem({ id: 'sprinkler', quantity: 2 })],
          });

          component.instance().setSprinkler(0, 0);
        });

        test('does not change hoveredPlotRangeSize', () => {
          expect(component.state().hoveredPlotRangeSize).toBe(1);
        });

        test('does not change fieldMode', () => {
          expect(component.state().fieldMode).toBe(fieldMode.SET_SPRINKLER);
        });

        test('does not change selectedItemId', () => {
          expect(component.state().selectedItemId).toBe(SPRINKLER_ITEM_ID);
        });
      });

      describe('one sprinkler unit remaining', () => {
        beforeEach(() => {
          component.instance().setSprinkler(0, 0);
        });

        test('resets hoveredPlotRangeSize', () => {
          expect(component.state().hoveredPlotRangeSize).toBe(0);
        });

        test('changes fieldMode to OBSERVE', () => {
          expect(component.state().fieldMode).toBe(fieldMode.OBSERVE);
        });

        test('resets selectedItemId', () => {
          expect(component.state().selectedItemId).toBe('');
        });
      });
    });
  });

  describe('setScarecrow', () => {
    beforeEach(() => {
      component.setState({
        field: [[null]],
        fieldMode: fieldMode.SET_SCARECROW,
        hoveredPlot: { x: 0, y: 0 },
        inventory: [testItem({ id: 'scarecrow', quantity: 1 })],
        selectedItemId: SCARECROW_ITEM_ID,
      });
    });

    describe('plot is not empty', () => {
      test('does nothing', () => {
        component.setState({ field: [[testCrop()]] });
        const beforeState = component.state();
        component.instance().setScarecrow(0, 0);
        const afterState = component.state();
        expect(afterState).toEqual(beforeState);
      });
    });

    describe('plot is empty', () => {
      test('decrements scarecrow from inventory', () => {
        component.instance().setScarecrow(0, 0);
        expect(component.state().inventory).toHaveLength(0);
      });

      test('sets scarecrow', () => {
        component.instance().setScarecrow(0, 0);
        expect(component.state().field[0][0]).toEqual(
          getPlotContentFromItemId('scarecrow')
        );
      });

      describe('multiple scarecrow units remaining', () => {
        beforeEach(() => {
          component.setState({
            inventory: [testItem({ id: 'scarecrow', quantity: 2 })],
          });

          component.instance().setScarecrow(0, 0);
        });

        test('does not change fieldMode', () => {
          expect(component.state().fieldMode).toBe(fieldMode.SET_SCARECROW);
        });

        test('does not change selectedItemId', () => {
          expect(component.state().selectedItemId).toBe(SCARECROW_ITEM_ID);
        });
      });

      describe('one scarecrow unit remaining', () => {
        beforeEach(() => {
          component.instance().setScarecrow(0, 0);
        });

        test('changes fieldMode to OBSERVE', () => {
          expect(component.state().fieldMode).toBe(fieldMode.OBSERVE);
        });

        test('resets selectedItemId', () => {
          expect(component.state().selectedItemId).toBe('');
        });
      });
    });
  });

  describe('harvestPlot', () => {
    describe('non-crop plotContent', () => {
      test('no-ops', () => {
        component.setState({
          field: [[getPlotContentFromItemId('sprinkler')]],
        });
        const oldState = component.state();
        component.instance().harvestPlot(0, 0);
        const newState = component.state();
        expect(newState).toEqual(oldState);
      });
    });

    describe('unripe crops', () => {
      beforeEach(() => {
        component.setState({
          field: [[testCrop({ itemId: 'sample-crop-1' })]],
        });

        component.instance().harvestPlot(0, 0);
      });

      test('does nothing', () => {
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

      test('removes the crop from the plot', () => {
        expect(component.state().field[0][0]).toBe(null);
      });

      test('adds crop to the inventory', () => {
        expect(component.state().inventory).toEqual([
          { id: 'sample-crop-1', quantity: 1 },
        ]);
      });
    });
  });

  describe('waterPlot', () => {
    describe('non-crop plotContent', () => {
      test('no-ops', () => {
        component.setState({
          field: [[getPlotContentFromItemId('sprinkler')]],
        });
        const oldState = component.state();
        component.instance().waterPlot(0, 0);
        const newState = component.state();
        expect(newState).toEqual(oldState);
      });
    });

    describe('crops', () => {
      test('sets wasWateredToday to true', () => {
        component.setState({
          field: [[testCrop({ itemId: 'sample-crop-1' })]],
        });

        component.instance().waterPlot(0, 0);
        expect(component.state().field[0][0].wasWateredToday).toBe(true);
      });
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

    test('sets wasWateredToday to true for all plots', () => {
      expect(component.state().field[0][0].wasWateredToday).toBe(true);
      expect(component.state().field[0][1].wasWateredToday).toBe(true);
      expect(component.state().field[1][0].wasWateredToday).toBe(true);
    });
  });

  describe('purchaseField', () => {
    test('updates purchasedField', () => {
      component.instance().purchaseField(0);
      expect(component.state().purchasedField).toEqual(0);
    });

    test('prevents repurchasing options', () => {
      component.setState({ purchasedField: 2 });
      component.instance().purchaseField(1);
      expect(component.state().purchasedField).toEqual(2);
    });

    test('deducts money', () => {
      component.setState({ money: 1500 });
      component.instance().purchaseField(1);
      expect(component.state().money).toEqual(500);
    });

    describe('field expansion', () => {
      beforeEach(() => {
        jest.resetModules();
        jest.mock('./constants', () => ({
          PURCHASEABLE_FIELD_SIZES: new Map([
            [1, { columns: 3, rows: 4, price: 1000 }],
          ]),
        }));

        stubLocalforage();
        const { default: Farmhand } = jest.requireActual('./Farmhand');

        component = shallow(<Farmhand />);
      });

      test('field expands without destroying existing data', () => {
        component.setState({
          field: [[testCrop(), null], [null, testCrop()]],
        });

        component.instance().purchaseField(1);
        expect(component.state().field).toEqual([
          [testCrop(), null, null],
          [null, testCrop(), null],
          [null, null, null],
          [null, null, null],
        ]);
      });
    });
  });
});
