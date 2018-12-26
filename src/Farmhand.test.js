import React from 'react';
import { shallow } from 'enzyme';
import localforage from 'localforage';
import { getCropFromItemId } from './utils';
import { testCrop, testItem } from './test-utils';
import { initialFieldWidth, initialFieldHeight } from './constants';
import { sampleItem1, sampleItem2, sampleCropSeedsItem1 } from './data/items';

import Farmhand, {
  addItemToInventory,
  computePlayerInventory,
  getFinalCropItemIdFromSeedItemId,
  getPlantableInventory,
  getUpdatedValueAdjustments,
  incrementAge,
  resetWasWatered,
} from './Farmhand';

jest.mock('localforage');
jest.mock('./data/maps');
jest.mock('./data/items');

let component;
let mathSpy;

beforeEach(() => {
  localforage.createInstance = () => ({
    getItem: () => Promise.resolve(null),
    setItem: data => Promise.resolve(data),
  });

  component = shallow(<Farmhand />);
});

describe('state', () => {
  it('inits field', () => {
    expect(component.state().field.length).toEqual(initialFieldHeight);
    expect(component.state().field[0].length).toEqual(initialFieldWidth);
  });
});

describe('private functions', () => {
  describe('addItemToInventory', () => {
    it('creates a new item in the inventory', () => {
      expect(addItemToInventory(testItem({ id: 'sample-item-1' }), [])).toEqual(
        [{ id: 'sample-item-1', quantity: 1 }]
      );
    });

    it('increments an existing item in the inventory', () => {
      expect(
        addItemToInventory(testItem({ id: 'sample-item-1' }), [
          testItem({ id: 'sample-item-1', quantity: 1 }),
        ])
      ).toEqual([
        testItem({
          id: 'sample-item-1',
          quantity: 2,
        }),
      ]);
    });
  });

  describe('computePlayerInventory', () => {
    let playerInventory;
    let inventory;
    let valueAdjustments;

    beforeEach(() => {
      inventory = [{ quantity: 1, id: 'sample-item-1' }];
      valueAdjustments = {};
      playerInventory = computePlayerInventory(inventory, valueAdjustments);
    });

    it('maps inventory state to renderable inventory data', () => {
      expect(playerInventory).toEqual([{ quantity: 1, ...sampleItem1 }]);
    });

    it('returns cached result with unchanged input', () => {
      const newPlayerInventory = computePlayerInventory(
        inventory,
        valueAdjustments
      );
      expect(playerInventory).toEqual(newPlayerInventory);
    });

    it('invalidates cache with changed input', () => {
      playerInventory = computePlayerInventory(
        [{ quantity: 1, id: 'sample-item-2' }],
        valueAdjustments
      );
      expect(playerInventory).toEqual([{ ...sampleItem2, quantity: 1 }]);
    });

    describe('with valueAdjustments', () => {
      beforeEach(() => {
        valueAdjustments = {
          'sample-item-1': 2,
        };

        playerInventory = computePlayerInventory(inventory, valueAdjustments);
      });

      it('maps inventory state to renderable inventory data', () => {
        expect(playerInventory).toEqual([
          { ...sampleItem1, quantity: 1, value: 2 },
        ]);
      });
    });
  });

  describe('getUpdatedValueAdjustments', () => {
    let valueAdjustments;

    beforeEach(() => {
      mathSpy = jest.spyOn(Math, 'random').mockImplementation(() => 1);
      valueAdjustments = getUpdatedValueAdjustments();
    });

    afterEach(() => {
      mathSpy.mockRestore();
    });

    it('updates valueAdjustments by random factor', () => {
      expect(valueAdjustments['sample-crop-1']).toEqual(1.5);
      expect(valueAdjustments['sample-crop-2']).toEqual(1.5);
    });
  });

  describe('getFinalCropItemIdFromSeedItemId', () => {
    it('gets "final" crop item id from seed item id', () => {
      expect(getFinalCropItemIdFromSeedItemId('sample-crop-seeds-1')).toEqual(
        'sample-crop-1'
      );
    });
  });

  describe('getPlantableInventory', () => {
    let plantableInventory;
    let inventory;

    beforeEach(() => {
      inventory = [
        { quantity: 1, id: 'sample-crop-seeds-1' },
        { quantity: 1, id: 'sample-item-1' },
      ];
      plantableInventory = getPlantableInventory(inventory);
    });

    it('filters out non-plantable items', () => {
      expect(plantableInventory).toEqual([sampleCropSeedsItem1]);
    });
  });
});

describe('instance methods', () => {
  let incrementDaySpy;

  describe('componentDidMount', () => {
    beforeEach(() => {
      incrementDaySpy = jest.spyOn(component.instance(), 'incrementDay');
    });

    describe('fresh boot', () => {
      beforeEach(() => {
        component.instance().componentDidMount();
      });

      it('increments the day by one', () => {
        expect(incrementDaySpy.mock.calls.length).toBe(1);
      });
    });

    describe('boot from persisted state', () => {
      beforeEach(() => {
        localforage.createInstance = () => ({
          getItem: () => Promise.resolve({ foo: 'bar' }),
          setItem: data => Promise.resolve(data),
        });

        component = shallow(<Farmhand />);
        component.instance().componentDidMount();
      });

      it('rehydrates from persisted state', () => {
        expect(incrementDaySpy.mock.calls.length).toBe(0);
        expect(component.state().foo).toBe('bar');
      });
    });
  });

  describe('incrementDay', () => {
    let setItemSpy;

    beforeEach(() => {
      mathSpy = jest.spyOn(Math, 'random').mockImplementation(() => 0.75);
      setItemSpy = jest.spyOn(component.instance().localforage, 'setItem');
      const firstRow = component.state().field[0];
      firstRow[0] = testCrop({
        itemId: 'sample-crop-1',
        wasWateredToday: true,
      });

      component.instance().incrementDay();
    });

    afterEach(() => {
      mathSpy.mockRestore();
    });

    it('updates component state', () => {
      const state = component.state();
      const {
        dayCount,
        field: [firstRow],
        valueAdjustments,
      } = state;

      expect(dayCount).toEqual(2);
      expect(valueAdjustments['sample-crop-1']).toEqual(1.25);
      expect(valueAdjustments['sample-crop-2']).toEqual(1.25);
      expect(firstRow[0].wasWateredToday).toBe(false);
      expect(firstRow[0].daysWatered).toBe(1);
      expect(firstRow[0].daysOld).toBe(1);
      expect(setItemSpy.mock.calls.length).toBe(1);
      expect(setItemSpy.mock.calls[0][1]).toEqual(state);
    });
  });

  describe('incrementAge', () => {
    describe('plant is not watered', () => {
      it('updates daysOld', () => {
        const { daysOld, daysWatered } = incrementAge(
          testCrop({ itemId: 'sample-crop-1' })
        );

        expect(daysOld).toBe(1);
        expect(daysWatered).toBe(0);
      });
    });

    describe('plant is watered', () => {
      it('updates daysOld and daysWatered', () => {
        const { daysOld, daysWatered } = incrementAge(
          testCrop({ itemId: 'sample-crop-1', wasWateredToday: true })
        );

        expect(daysOld).toBe(1);
        expect(daysWatered).toBe(1);
      });
    });
  });

  describe('resetWasWatered', () => {
    it('updates wasWateredToday property', () => {
      expect(resetWasWatered(testCrop({ itemId: 'sample-crop-1' }))).toEqual(
        testCrop({ itemId: 'sample-crop-1' })
      );

      expect(
        resetWasWatered(
          testCrop({ itemId: 'sample-crop-2', wasWateredToday: true })
        )
      ).toEqual(testCrop({ itemId: 'sample-crop-2' }));

      expect(resetWasWatered(null)).toBe(null);
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

  describe('plantInPlot', () => {
    beforeEach(() => {
      component.setState({
        selectedPlantableItemId: 'sample-crop-seeds-1',
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

      it('resets selectedPlantableItemId state', () => {
        expect(component.state().selectedPlantableItemId).toEqual('');
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
