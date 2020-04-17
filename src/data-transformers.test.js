import { shapeOf, testCrop, testItem } from './test-utils';
import { RAIN_MESSAGE } from './strings';
import { MILK_PRODUCED, CROW_ATTACKED } from './templates';
import {
  COW_FEED_ITEM_ID,
  COW_HUG_BENEFIT,
  COW_MILK_RATE_SLOWEST,
  COW_WEIGHT_MULTIPLIER_MAXIMUM,
  COW_WEIGHT_MULTIPLIER_FEED_BENEFIT,
  FERTILIZER_BONUS,
  SCARECROW_ITEM_ID,
} from './constants';
import {
  sampleItem1,
  sampleItem2,
  sampleCropSeedsItem1,
  sampleFieldTool1,
} from './data/items';
import { itemsMap } from './data/maps';
import { genders } from './enums';
import { generateCow, getCowMilkItem, getPlotContentFromItemId } from './utils';
import * as fn from './data-transformers';

jest.mock('localforage');
jest.mock('./data/maps');
jest.mock('./data/items');
jest.mock('./data/recipes');

jest.mock('./constants', () => ({
  __esModule: true,
  ...jest.requireActual('./constants'),
  COW_HUG_BENEFIT: 0.5,
  CROW_CHANCE: 0,
  RAIN_CHANCE: 0,
}));

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
      cowInventory: [],
      inventory: [],
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

describe('processSprinklers', () => {
  let computedState;

  beforeEach(() => {
    const field = new Array(8).fill().map(() => new Array(8).fill(null));
    field[0][0] = getPlotContentFromItemId('sprinkler');
    field[1][1] = getPlotContentFromItemId('sprinkler');
    field[6][5] = getPlotContentFromItemId('sprinkler');
    field[1][0] = testCrop();
    field[2][2] = testCrop();
    field[3][3] = testCrop();

    computedState = fn.processSprinklers({
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

describe('processFeedingCows', () => {
  let state;

  beforeEach(() => {
    state = {
      cowInventory: [],
      inventory: [],
    };
  });

  describe('player has no cow feed', () => {
    beforeEach(() => {
      state.cowInventory = [generateCow({ weightMultiplier: 1 })];
    });

    test('cows weight goes down', () => {
      const {
        cowInventory: [{ weightMultiplier }],
      } = fn.processFeedingCows(state);

      expect(weightMultiplier).toEqual(1 - COW_WEIGHT_MULTIPLIER_FEED_BENEFIT);
    });
  });

  describe('player has cow feed', () => {
    beforeEach(() => {
      state.cowInventory = [
        generateCow({ weightMultiplier: 1 }),
        generateCow({ weightMultiplier: 1 }),
      ];
    });

    describe('there are more feed units than cows to feed', () => {
      test('units are distributed to cows', () => {
        state.inventory = [{ id: COW_FEED_ITEM_ID, quantity: 4 }];
        const {
          cowInventory,
          inventory: [{ quantity }],
        } = fn.processFeedingCows(state);

        expect(cowInventory[0].weightMultiplier).toEqual(
          1 + COW_WEIGHT_MULTIPLIER_FEED_BENEFIT
        );
        expect(cowInventory[1].weightMultiplier).toEqual(
          1 + COW_WEIGHT_MULTIPLIER_FEED_BENEFIT
        );
        expect(quantity).toEqual(2);
      });
    });

    describe('there are more cows to feed than feed units', () => {
      test('units are distributed to cows and remainder goes hungry', () => {
        state.inventory = [{ id: COW_FEED_ITEM_ID, quantity: 1 }];
        const { cowInventory, inventory } = fn.processFeedingCows(state);

        expect(cowInventory[0].weightMultiplier).toEqual(
          1 + COW_WEIGHT_MULTIPLIER_FEED_BENEFIT
        );
        expect(cowInventory[1].weightMultiplier).toEqual(
          1 - COW_WEIGHT_MULTIPLIER_FEED_BENEFIT
        );
        expect(inventory).toHaveLength(0);
      });
    });

    describe('mixed set of weightMultipliers with unsufficient cow feed units', () => {
      test('units are distributed to cows and remainder goes hungry', () => {
        state.cowInventory = [
          generateCow({ weightMultiplier: COW_WEIGHT_MULTIPLIER_MAXIMUM }),
          generateCow({ weightMultiplier: COW_WEIGHT_MULTIPLIER_MAXIMUM }),
          generateCow({ weightMultiplier: 1 }),
          generateCow({ weightMultiplier: 1 }),
        ];

        state.inventory = [{ id: COW_FEED_ITEM_ID, quantity: 3 }];

        const { cowInventory, inventory } = fn.processFeedingCows(state);

        expect(cowInventory[0].weightMultiplier).toEqual(
          COW_WEIGHT_MULTIPLIER_MAXIMUM
        );
        expect(cowInventory[1].weightMultiplier).toEqual(
          COW_WEIGHT_MULTIPLIER_MAXIMUM
        );
        expect(cowInventory[2].weightMultiplier).toEqual(
          1 + COW_WEIGHT_MULTIPLIER_FEED_BENEFIT
        );
        expect(cowInventory[3].weightMultiplier).toEqual(
          1 - COW_WEIGHT_MULTIPLIER_FEED_BENEFIT
        );
        expect(inventory).toHaveLength(0);
      });
    });
  });
});

describe('processMilkingCows', () => {
  let state;

  beforeEach(() => {
    state = {
      cowInventory: [],
      inventory: [],
      newDayNotifications: [],
    };
  });

  describe('cow should not be milked', () => {
    test('cow is not milked', () => {
      const baseDaysSinceMilking = 2;

      state.cowInventory = [
        generateCow({
          daysSinceMilking: baseDaysSinceMilking,
          gender: genders.FEMALE,
        }),
      ];

      const {
        cowInventory: [{ daysSinceMilking }],
        inventory,
        newDayNotifications,
      } = fn.processMilkingCows(state);

      expect(daysSinceMilking).toEqual(baseDaysSinceMilking);
      expect(inventory).toEqual([]);
      expect(newDayNotifications).toEqual([]);
    });
  });

  describe('cow should be milked', () => {
    test('cow is milked', () => {
      state.cowInventory = [
        generateCow({
          daysSinceMilking: Math.ceil(COW_MILK_RATE_SLOWEST / 2),
          gender: genders.FEMALE,
        }),
      ];

      const {
        cowInventory: [cow],
        inventory,
        newDayNotifications,
      } = fn.processMilkingCows(state);

      const { daysSinceMilking } = cow;

      expect(daysSinceMilking).toEqual(0);
      expect(inventory).toEqual([{ id: 'milk-1', quantity: 1 }]);
      expect(newDayNotifications).toEqual([
        MILK_PRODUCED`${cow}${getCowMilkItem(cow)}`,
      ]);
    });
  });
});

describe('processBuffs', () => {
  describe('rain', () => {
    describe('is not rainy day', () => {
      test('does not water plants', () => {
        const state = fn.processBuffs({
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

        const { processBuffs } = jest.requireActual('./data-transformers');
        const state = processBuffs({
          field: [[testCrop()]],
          newDayNotifications: [],
        });

        expect(state.field[0][0].wasWateredToday).toBe(true);
      });
    });
  });
});

describe('processNerfs', () => {
  describe('crows', () => {
    describe('crows do not attack', () => {
      test('crop is safe', () => {
        const state = fn.processNerfs({
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

        const { processNerfs } = jest.requireActual('./data-transformers');
        const state = processNerfs({
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

          const { processNerfs } = jest.requireActual('./data-transformers');
          const state = processNerfs({
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

  describe('item has a fluctuating price', () => {
    test('updates valueAdjustments by random factor', () => {
      expect(valueAdjustments['sample-crop-1']).toEqual(1.5);
      expect(valueAdjustments['sample-crop-2']).toEqual(1.5);
    });
  });

  describe('item does not have a fluctuating price', () => {
    test('valueAdjustments value is not defined', () => {
      expect(valueAdjustments['sample-field-tool-1']).toEqual(undefined);
    });
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

describe('computeCowInventoryForNextDay', () => {
  test('ages cows', () => {
    expect(
      fn.computeCowInventoryForNextDay({
        cowInventory: [
          { daysOld: 0 },
          { daysOld: 5, happiness: 0.5, happinessBoostsToday: 3 },
        ],
      })
    ).toMatchObject([
      { daysOld: 1, happinessBoostsToday: 0 },
      { daysOld: 6, happiness: 0.5 - COW_HUG_BENEFIT, happinessBoostsToday: 0 },
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

describe('incrementCropAge', () => {
  describe('plant is not watered', () => {
    test('updates daysOld', () => {
      const { daysOld, daysWatered } = fn.incrementCropAge(
        testCrop({ itemId: 'sample-crop-1' })
      );

      expect(daysOld).toBe(1);
      expect(daysWatered).toBe(0);
    });
  });

  describe('plant is watered', () => {
    test('updates daysOld and daysWatered', () => {
      const { daysOld, daysWatered } = fn.incrementCropAge(
        testCrop({ itemId: 'sample-crop-1', wasWateredToday: true })
      );

      expect(daysOld).toBe(1);
      expect(daysWatered).toBe(1);
    });
  });

  describe('plant is fertilized', () => {
    test('updates daysOld with bonus', () => {
      const { daysWatered } = fn.incrementCropAge(
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

  describe('item is not in inventory', () => {
    beforeEach(() => {
      updatedInventory = fn.decrementItemFromInventory('nonexistent-item', [
        testItem({ id: 'sample-item-1', quantity: 1 }),
      ]);
    });

    test('no-ops', () => {
      expect(updatedInventory).toEqual([
        testItem({ id: 'sample-item-1', quantity: 1 }),
      ]);
    });
  });

  describe('item is in inventory', () => {
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

describe('computeLearnedRecipes', () => {
  describe('recipe condition is not met', () => {
    test('recipe is not in the returned map', () => {
      const newlyUnlockedRecipes = fn.computeLearnedRecipes({
        itemsSold: {},
      });

      expect(newlyUnlockedRecipes['sample-recipe-1']).toBe(undefined);
    });
  });

  describe('recipe condition is met', () => {
    test('recipe is in the returned map', () => {
      const newlyUnlockedRecipes = fn.computeLearnedRecipes({
        itemsSold: { 'sample-item-1': 3 },
      });

      expect(newlyUnlockedRecipes['sample-recipe-1']).toEqual(true);
    });
  });
});
