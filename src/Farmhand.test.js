import React from 'react';
import { shallow } from 'enzyme';
import localforage from 'localforage';
import { getCropFromItemId } from './utils';
import { testCrop, testItem } from './test-utils';
import {
  FERTILIZER_BONUS,
  INITIAL_FIELD_WIDTH,
  INITIAL_FIELD_HEIGHT,
} from './constants';
import { PROGRESS_SAVED_MESSAGE, RAIN_MESSAGE } from './strings';
import { fieldMode } from './enums';
import {
  sampleItem1,
  sampleItem2,
  sampleCropSeedsItem1,
  sampleFieldTool1,
} from './data/items';

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

afterEach(() => {
  jest.restoreAllMocks();
});

describe('state', () => {
  it('inits field', () => {
    expect(component.state().field).toHaveLength(INITIAL_FIELD_HEIGHT);
    expect(component.state().field[0]).toHaveLength(INITIAL_FIELD_WIDTH);
  });
});

describe('static functions', () => {
  describe('computeStateForNextDay', () => {
    beforeEach(() => {
      jest.spyOn(Math, 'random').mockReturnValue(0.75);
      jest.spyOn(Farmhand, 'applyBuffs');
    });

    it('computes state for next day', () => {
      const {
        dayCount,
        field: [firstRow],
        valueAdjustments,
      } = Farmhand.computeStateForNextDay({
        dayCount: 1,
        field: [
          [
            testCrop({
              itemId: 'sample-crop-1',
              wasWateredToday: true,
            }),
          ],
        ],
      });

      expect(dayCount).toEqual(2);
      expect(valueAdjustments['sample-crop-1']).toEqual(1.25);
      expect(valueAdjustments['sample-crop-2']).toEqual(1.25);
      expect(firstRow[0].wasWateredToday).toBe(false);
      expect(firstRow[0].daysWatered).toBe(1);
      expect(firstRow[0].daysOld).toBe(1);
      expect(Farmhand.applyBuffs).toBeCalled();
    });
  });

  describe('applyRain', () => {
    it('waters all plots', () => {
      const state = Farmhand.applyRain({
        field: [
          [
            testCrop({
              wasWateredToday: false,
            }),
            testCrop({
              wasWateredToday: false,
            }),
          ],
        ],
        newDayNotifications: [],
      });

      expect(state.field[0][0].wasWateredToday).toBe(true);
      expect(state.field[0][1].wasWateredToday).toBe(true);
      expect(state.newDayNotifications[0].message).toBe(RAIN_MESSAGE);
    });
  });

  describe('applyBuffs', () => {
    describe('rain', () => {
      beforeEach(() => {
        jest.spyOn(Farmhand, 'applyRain');
      });

      describe('is not rainy day', () => {
        beforeEach(() => {
          Farmhand.applyBuffs(component.state());
        });

        it('does not call applyRain', () => {
          expect(Farmhand.applyRain).not.toHaveBeenCalled();
        });
      });

      describe('is rainy day', () => {
        it('calls applyRain', () => {
          jest.resetModules();
          jest.mock('./constants', () => ({
            RAIN_CHANCE: 1,
          }));

          const { default: Farmhand } = jest.requireActual('./Farmhand');

          jest.spyOn(Farmhand, 'applyRain');
          Farmhand.applyBuffs(component.state());

          expect(Farmhand.applyRain).toHaveBeenCalledWith(component.state());
        });
      });
    });
  });

  describe('computePlayerInventory', () => {
    let playerInventory;
    let inventory;
    let valueAdjustments;

    beforeEach(() => {
      inventory = [{ quantity: 1, id: 'sample-item-1' }];
      valueAdjustments = {};
      playerInventory = Farmhand.computePlayerInventory(
        inventory,
        valueAdjustments
      );
    });

    it('maps inventory state to renderable inventory data', () => {
      expect(playerInventory).toEqual([{ quantity: 1, ...sampleItem1 }]);
    });

    it('returns cached result with unchanged input', () => {
      const newPlayerInventory = Farmhand.computePlayerInventory(
        inventory,
        valueAdjustments
      );
      expect(playerInventory).toEqual(newPlayerInventory);
    });

    it('invalidates cache with changed input', () => {
      playerInventory = Farmhand.computePlayerInventory(
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

        playerInventory = Farmhand.computePlayerInventory(
          inventory,
          valueAdjustments
        );
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
      jest.spyOn(Math, 'random').mockReturnValue(1);
      valueAdjustments = Farmhand.getUpdatedValueAdjustments();
    });

    it('updates valueAdjustments by random factor', () => {
      expect(valueAdjustments['sample-crop-1']).toEqual(1.5);
      expect(valueAdjustments['sample-crop-2']).toEqual(1.5);
    });
  });

  describe('addItemToInventory', () => {
    it('creates a new item in the inventory', () => {
      expect(
        Farmhand.addItemToInventory(testItem({ id: 'sample-item-1' }), [])
      ).toEqual([{ id: 'sample-item-1', quantity: 1 }]);
    });

    it('increments an existing item in the inventory', () => {
      expect(
        Farmhand.addItemToInventory(testItem({ id: 'sample-item-1' }), [
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

  describe('getFieldToolInventory', () => {
    let fieldToolInventory;
    let inventory;

    beforeEach(() => {
      inventory = [{ id: 'sample-field-tool-1' }, { id: 'sample-item-1' }];
      fieldToolInventory = Farmhand.getFieldToolInventory(inventory);
    });

    it('filters out non-field tool items', () => {
      expect(fieldToolInventory).toEqual([sampleFieldTool1]);
    });
  });

  describe('getFinalCropItemIdFromSeedItemId', () => {
    it('gets "final" crop item id from seed item id', () => {
      expect(
        Farmhand.getFinalCropItemIdFromSeedItemId('sample-crop-seeds-1')
      ).toEqual('sample-crop-1');
    });
  });

  describe('getPlantableInventory', () => {
    let plantableInventory;
    let inventory;

    beforeEach(() => {
      inventory = [{ id: 'sample-crop-seeds-1' }, { id: 'sample-item-1' }];
      plantableInventory = Farmhand.getPlantableInventory(inventory);
    });

    it('filters out non-plantable items', () => {
      expect(plantableInventory).toEqual([sampleCropSeedsItem1]);
    });
  });

  describe('decrementItemFromInventory', () => {
    let updatedInventory;

    describe('single instance of item in inventory', () => {
      beforeEach(() => {
        updatedInventory = Farmhand.decrementItemFromInventory(
          'sample-item-1',
          [testItem({ id: 'sample-item-1', quantity: 1 })]
        );
      });

      it('removes item from inventory', () => {
        expect(updatedInventory).toEqual([]);
      });
    });

    describe('multiple instances of item in inventory', () => {
      beforeEach(() => {
        updatedInventory = Farmhand.decrementItemFromInventory(
          'sample-item-1',
          [testItem({ id: 'sample-item-1', quantity: 2 })]
        );
      });

      it('decrements item', () => {
        expect(updatedInventory).toEqual([
          testItem({
            id: 'sample-item-1',
            quantity: 1,
          }),
        ]);
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

  describe('incrementAge', () => {
    describe('plant is not watered', () => {
      it('updates daysOld', () => {
        const { daysOld, daysWatered } = Farmhand.incrementAge(
          testCrop({ itemId: 'sample-crop-1' })
        );

        expect(daysOld).toBe(1);
        expect(daysWatered).toBe(0);
      });
    });

    describe('plant is watered', () => {
      it('updates daysOld and daysWatered', () => {
        const { daysOld, daysWatered } = Farmhand.incrementAge(
          testCrop({ itemId: 'sample-crop-1', wasWateredToday: true })
        );

        expect(daysOld).toBe(1);
        expect(daysWatered).toBe(1);
      });
    });

    describe('plant is fertilized', () => {
      it('updates daysOld with bonus', () => {
        const { daysWatered } = Farmhand.incrementAge(
          testCrop({
            itemId: 'sample-crop-1',
            isFertilized: true,
            wasWateredToday: true,
          })
        );

        expect(daysWatered).toBe(1 + FERTILIZER_BONUS);
      });
    });
  });

  describe('resetWasWatered', () => {
    it('updates wasWateredToday property', () => {
      expect(
        Farmhand.resetWasWatered(testCrop({ itemId: 'sample-crop-1' }))
      ).toEqual(testCrop({ itemId: 'sample-crop-1' }));

      expect(
        Farmhand.resetWasWatered(
          testCrop({ itemId: 'sample-crop-2', wasWateredToday: true })
        )
      ).toEqual(testCrop({ itemId: 'sample-crop-2' }));

      expect(Farmhand.resetWasWatered(null)).toBe(null);
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
      jest.spyOn(Farmhand, 'decrementItemFromInventory');

      component.setState({
        inventory: [testItem({ id: 'sample-item-1', quantity: 1 })],
        money: 100,
      });

      component
        .instance()
        .sellItem(testItem({ id: 'sample-item-1', value: 20 }));
    });

    it('decrements item from inventory', () => {
      expect(Farmhand.decrementItemFromInventory).toHaveBeenCalledWith(
        'sample-item-1',
        [testItem({ id: 'sample-item-1', quantity: 1 })]
      );
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
          jest.spyOn(Farmhand, 'decrementItemFromInventory');

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
          expect(Farmhand.decrementItemFromInventory).toHaveBeenCalledWith(
            'fertilizer',
            [testItem({ id: 'fertilizer', quantity: 1 })]
          );
        });
      });

      describe('plot is already fertilized', () => {
        beforeEach(() => {
          jest.spyOn(Farmhand, 'decrementItemFromInventory');

          component.setState({
            field: [
              [testCrop({ itemId: 'sample-crop-1', isFertilized: true })],
            ],
            inventory: [testItem({ id: 'fertilizer', quantity: 1 })],
          });

          component.instance().fertilizePlot(0, 0);
        });

        it('does not modify inventory', () => {
          expect(Farmhand.decrementItemFromInventory).not.toHaveBeenCalled();
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
