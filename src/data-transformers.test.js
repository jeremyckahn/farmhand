import { shapeOf, testCrop, testItem } from './test-utils';
import { RAIN_MESSAGE } from './strings';
import { CROW_ATTACKED } from './templates';
import { FERTILIZER_BONUS, SCARECROW_ITEM_ID } from './constants';
import {
  sampleItem1,
  sampleItem2,
  sampleCropSeedsItem1,
  sampleFieldTool1,
} from './data/items';
import { itemsMap } from './data/maps';
import { generateCow, getPlotContentFromItemId } from './utils';
import * as fn from './data-transformers';

jest.mock('localforage');
jest.mock('./data/maps');
jest.mock('./data/items');
jest.mock('./constants');

describe('computeStateForNextDay', () => {
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.75);
  });

  test('computes state for next day', () => {
    const {
      cowForSale,
      dayCount,
      field: [firstRow],
      valueAdjustments,
    } = fn.computeStateForNextDay({
      dayCount: 1,
      field: [
        [
          testCrop({
            itemId: 'sample-crop-1',
            wasWateredToday: true,
          }),
        ],
      ],
      newDayNotifications: [],
    });

    expect(shapeOf(cowForSale)).toEqual(shapeOf(generateCow()));
    expect(dayCount).toEqual(2);
    expect(valueAdjustments['sample-crop-1']).toEqual(1.25);
    expect(valueAdjustments['sample-crop-2']).toEqual(1.25);
    expect(firstRow[0].wasWateredToday).toBe(false);
    expect(firstRow[0].daysWatered).toBe(1);
    expect(firstRow[0].daysOld).toBe(1);
  });
});

describe('applyRain', () => {
  test('waters all plots', () => {
    const state = fn.applyRain({
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
    expect(state.newDayNotifications[0]).toBe(RAIN_MESSAGE);
  });
});

describe('applySprinklers', () => {
  let computedState;

  beforeEach(() => {
    const field = new Array(8).fill().map(() => new Array(8).fill(null));
    field[0][0] = getPlotContentFromItemId('sprinkler');
    field[1][1] = getPlotContentFromItemId('sprinkler');
    field[6][5] = getPlotContentFromItemId('sprinkler');
    field[1][0] = testCrop();
    field[2][2] = testCrop();
    field[3][3] = testCrop();

    computedState = fn.applySprinklers({
      field,
    });
  });

  test('waters crops within range', () => {
    expect(computedState.field[1][0].wasWateredToday).toBeTruthy();
    expect(computedState.field[2][2].wasWateredToday).toBeTruthy();
  });

  test('does not water crops out of range', () => {
    expect(computedState.field[3][3].wasWateredToday).toBeFalsy();
  });
});

describe('applyBuffs', () => {
  describe('rain', () => {
    describe('is not rainy day', () => {
      test('does not water plants', () => {
        const state = fn.applyBuffs({
          field: [[testCrop()]],
          newDayNotifications: [],
        });

        expect(state.field[0][0].wasWateredToday).toBe(false);
      });
    });

    describe('is rainy day', () => {
      test('does water plants', () => {
        jest.resetModules();
        jest.mock('./constants', () => ({
          RAIN_CHANCE: 1,
        }));

        const { applyBuffs } = jest.requireActual('./data-transformers');
        const state = applyBuffs({
          field: [[testCrop()]],
          newDayNotifications: [],
        });

        expect(state.field[0][0].wasWateredToday).toBe(true);
      });
    });
  });
});

describe('applyNerfs', () => {
  describe('crows', () => {
    describe('crows do not attack', () => {
      test('crop is safe', () => {
        const state = fn.applyNerfs({
          field: [[testCrop({ itemId: 'sample-crop-1' })]],
          newDayNotifications: [],
        });

        expect(state.field[0][0]).toEqual(
          testCrop({ itemId: 'sample-crop-1' })
        );
        expect(state.newDayNotifications).toEqual([]);
      });
    });

    describe('crows attack', () => {
      test('crop is destroyed', () => {
        jest.resetModules();
        jest.mock('./constants', () => ({
          CROW_CHANCE: 1,
        }));

        const { applyNerfs } = jest.requireActual('./data-transformers');
        const state = applyNerfs({
          field: [[testCrop({ itemId: 'sample-crop-1' })]],
          newDayNotifications: [],
        });

        expect(state.field[0][0]).toBe(null);
        expect(state.newDayNotifications).toEqual([
          CROW_ATTACKED`${itemsMap['sample-crop-1']}`,
        ]);
      });

      describe('there is a scarecrow', () => {
        test('crow attack is prevented', () => {
          jest.resetModules();
          jest.mock('./constants', () => ({
            CROW_CHANCE: 1,
            SCARECROW_ITEM_ID: 'scarecrow',
          }));

          const { applyNerfs } = jest.requireActual('./data-transformers');
          const state = applyNerfs({
            field: [
              [
                testCrop({ itemId: 'sample-crop-1' }),
                getPlotContentFromItemId(SCARECROW_ITEM_ID),
              ],
            ],
            newDayNotifications: [],
          });

          expect(state.field[0][0]).toEqual(
            testCrop({ itemId: 'sample-crop-1' })
          );
          expect(state.newDayNotifications).toEqual([]);
        });
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
    playerInventory = fn.computePlayerInventory(inventory, valueAdjustments);
  });

  test('maps inventory state to renderable inventory data', () => {
    expect(playerInventory).toEqual([{ quantity: 1, ...sampleItem1 }]);
  });

  test('returns cached result with unchanged input', () => {
    const newPlayerInventory = fn.computePlayerInventory(
      inventory,
      valueAdjustments
    );
    expect(playerInventory).toEqual(newPlayerInventory);
  });

  test('invalidates cache with changed input', () => {
    playerInventory = fn.computePlayerInventory(
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

      playerInventory = fn.computePlayerInventory(inventory, valueAdjustments);
    });

    test('maps inventory state to renderable inventory data', () => {
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
    valueAdjustments = fn.getUpdatedValueAdjustments();
  });

  test('updates valueAdjustments by random factor', () => {
    expect(valueAdjustments['sample-crop-1']).toEqual(1.5);
    expect(valueAdjustments['sample-crop-2']).toEqual(1.5);
  });
});

describe('resetWasWatered', () => {
  test('updates wasWateredToday property', () => {
    expect(fn.resetWasWatered(testCrop({ itemId: 'sample-crop-1' }))).toEqual(
      testCrop({ itemId: 'sample-crop-1' })
    );

    expect(
      fn.resetWasWatered(
        testCrop({ itemId: 'sample-crop-2', wasWateredToday: true })
      )
    ).toEqual(testCrop({ itemId: 'sample-crop-2' }));

    expect(fn.resetWasWatered(null)).toBe(null);
  });
});

describe('addItemToInventory', () => {
  test('creates a new item in the inventory', () => {
    expect(
      fn.addItemToInventory(testItem({ id: 'sample-item-1' }), [])
    ).toEqual([{ id: 'sample-item-1', quantity: 1 }]);
  });

  test('increments an existing item in the inventory', () => {
    expect(
      fn.addItemToInventory(testItem({ id: 'sample-item-1' }), [
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

  beforeEach(() => {
    fieldToolInventory = fn.getFieldToolInventory([
      sampleFieldTool1,
      sampleCropSeedsItem1,
    ]);
  });

  test('filters out non-field tool items', () => {
    expect(fieldToolInventory).toEqual([sampleFieldTool1]);
  });
});

describe('getFinalCropItemIdFromSeedItemId', () => {
  test('gets "final" crop item id from seed item id', () => {
    expect(fn.getFinalCropItemIdFromSeedItemId('sample-crop-seeds-1')).toEqual(
      'sample-crop-1'
    );
  });
});

describe('getPlantableCropInventory', () => {
  let plantableCropInventory;
  let inventory;

  beforeEach(() => {
    inventory = [{ id: 'sample-crop-seeds-1' }, { id: 'sample-item-1' }];
    plantableCropInventory = fn.getPlantableCropInventory(inventory);
  });

  test('filters out non-plantable items', () => {
    expect(plantableCropInventory).toEqual([sampleCropSeedsItem1]);
  });
});

describe('incrementAge', () => {
  describe('plant is not watered', () => {
    test('updates daysOld', () => {
      const { daysOld, daysWatered } = fn.incrementAge(
        testCrop({ itemId: 'sample-crop-1' })
      );

      expect(daysOld).toBe(1);
      expect(daysWatered).toBe(0);
    });
  });

  describe('plant is watered', () => {
    test('updates daysOld and daysWatered', () => {
      const { daysOld, daysWatered } = fn.incrementAge(
        testCrop({ itemId: 'sample-crop-1', wasWateredToday: true })
      );

      expect(daysOld).toBe(1);
      expect(daysWatered).toBe(1);
    });
  });

  describe('plant is fertilized', () => {
    test('updates daysOld with bonus', () => {
      const { daysWatered } = fn.incrementAge(
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

describe('decrementItemFromInventory', () => {
  let updatedInventory;

  describe('single instance of item in inventory', () => {
    beforeEach(() => {
      updatedInventory = fn.decrementItemFromInventory('sample-item-1', [
        testItem({ id: 'sample-item-1', quantity: 1 }),
      ]);
    });

    test('removes item from inventory', () => {
      expect(updatedInventory).toEqual([]);
    });
  });

  describe('multiple instances of item in inventory', () => {
    beforeEach(() => {
      updatedInventory = fn.decrementItemFromInventory('sample-item-1', [
        testItem({ id: 'sample-item-1', quantity: 2 }),
      ]);
    });

    test('decrements item', () => {
      expect(updatedInventory).toEqual([
        testItem({
          id: 'sample-item-1',
          quantity: 1,
        }),
      ]);
    });
  });
});

describe('purchaseItem', () => {
  describe('howMany === 0', () => {
    test('no-ops', () => {
      expect(
        fn.purchaseItem(testItem({ id: 'sample-item-1' }), 0, {
          inventory: [],
          money: 0,
          valueAdjustments: { 'sample-item-1': 1 },
        })
      ).toEqual({});
    });
  });

  describe('user does not have enough money', () => {
    test('no-ops', () => {
      expect(
        fn.purchaseItem(testItem({ id: 'sample-item-1' }), 1, {
          inventory: [],
          money: 0,
          valueAdjustments: { 'sample-item-1': 1 },
        })
      ).toEqual({});
    });
  });

  describe('user has enough money', () => {
    test('purchases item', () => {
      expect(
        fn.purchaseItem(testItem({ id: 'sample-item-1' }), 2, {
          inventory: [],
          money: 10,
          valueAdjustments: { 'sample-item-1': 1 },
        })
      ).toEqual({
        inventory: [{ id: 'sample-item-1', quantity: 2 }],
        money: 8,
      });
    });
  });
});
