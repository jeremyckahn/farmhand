/* eslint-disable import/first */
jest.mock('./data/maps');
jest.mock('./data/items');

import React from 'react';
import { shallow } from 'enzyme';
import { getCropFromItemId } from './utils';
import { testCrop, testItem } from './test-utils';
import { initialFieldWidth, initialFieldHeight } from './constants';
import { sampleItem1, sampleItem2, sampleItem3 } from './data/items';

import App, {
  computePlayerInventory,
  getPlantableInventory,
  getUpdatedValueAdjustments,
  incrementCropAge,
  incrementedFieldAge,
  resetFieldWasWateredState,
} from './App';

let component;
let mathSpy;

beforeEach(() => {
  component = shallow(<App />);
});

describe('state', () => {
  it('inits field', () => {
    expect(component.state().field.length).toEqual(initialFieldHeight);
    expect(component.state().field[0].length).toEqual(initialFieldWidth);
  });
});

describe('private functions', () => {
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
      expect(playerInventory).toEqual([{ quantity: 1, ...sampleItem2 }]);
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
          { quantity: 1, ...testItem({ id: 'sample-item-1', value: 2 }) },
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
      expect(valueAdjustments['sample-item-1']).toEqual(1.5);
      expect(valueAdjustments['sample-item-2']).toEqual(1.5);
    });
  });

  describe('getPlantableInventory', () => {
    let plantableInventory;
    let inventory;

    beforeEach(() => {
      inventory = [
        { quantity: 1, id: 'sample-item-1' },
        { quantity: 1, id: 'sample-item-3' },
      ];
      plantableInventory = getPlantableInventory(inventory);
    });

    it('filters out non-plantable items', () => {
      expect(plantableInventory).toEqual([sampleItem3]);
    });
  });
});

describe('instance methods', () => {
  describe('incrementDay', () => {
    beforeEach(() => {
      mathSpy = jest.spyOn(Math, 'random').mockImplementation(() => 0.75);
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
      const {
        dayCount,
        field: [firstRow],
        valueAdjustments,
      } = component.state();

      expect(dayCount).toEqual(2);
      expect(valueAdjustments['sample-item-1']).toEqual(1.25);
      expect(valueAdjustments['sample-item-2']).toEqual(1.25);
      expect(firstRow[0].wasWateredToday).toBe(false);
      expect(firstRow[0].daysWatered).toBe(1);
      expect(firstRow[0].daysOld).toBe(1);
    });
  });

  describe('incrementCropAge', () => {
    describe('plant is not watered', () => {
      it('updates daysOld', () => {
        const { daysOld, daysWatered } = incrementCropAge(
          testCrop({ itemId: 'sample-item-1' })
        );

        expect(daysOld).toBe(1);
        expect(daysWatered).toBe(0);
      });
    });

    describe('plant is watered', () => {
      it('updates daysOld and daysWatered', () => {
        const { daysOld, daysWatered } = incrementCropAge(
          testCrop({ itemId: 'sample-item-1', wasWateredToday: true })
        );

        expect(daysOld).toBe(1);
        expect(daysWatered).toBe(1);
      });
    });
  });

  describe('incrementedFieldAge', () => {
    let field;

    beforeEach(() => {
      field = [
        [
          testCrop({ itemId: 'sample-item-1' }),
          testCrop({ itemId: 'sample-item-2' }),
          testCrop({ itemId: 'sample-item-3' }),
        ],
        [
          testCrop({ itemId: 'sample-item-1', daysOld: 1 }),
          testCrop({ itemId: 'sample-item-1', daysOld: 2 }),
          testCrop({ itemId: 'sample-item-1', daysOld: 3 }),
        ],
      ];
    });

    it('update daysOld across all crops', () => {
      expect(incrementedFieldAge(field)).toEqual([
        [
          testCrop({ itemId: 'sample-item-1', daysOld: 1 }),
          testCrop({ itemId: 'sample-item-2', daysOld: 1 }),
          testCrop({ itemId: 'sample-item-3', daysOld: 1 }),
        ],
        [
          testCrop({ itemId: 'sample-item-1', daysOld: 2 }),
          testCrop({ itemId: 'sample-item-1', daysOld: 3 }),
          testCrop({ itemId: 'sample-item-1', daysOld: 4 }),
        ],
      ]);
    });
  });

  describe('resetFieldWasWateredState', () => {
    let field;

    beforeEach(() => {
      field = [
        [
          testCrop({ itemId: 'sample-item-1' }),
          null,
          testCrop({ itemId: 'sample-item-2', wasWateredToday: true }),
        ],
      ];
    });

    it('update wasWateredToday across all crops', () => {
      const [row] = resetFieldWasWateredState(field);

      expect(row).toEqual(
        expect.arrayContaining([
          testCrop({ itemId: 'sample-item-1' }),
          null,
          testCrop({ itemId: 'sample-item-2' }),
        ])
      );
    });
  });

  describe('plantInPlot', () => {
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

          component.instance().plantInPlot(0, 0, 'sample-item-3');
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

          component.instance().plantInPlot(0, 0, 'sample-item-3');
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

        component.instance().plantInPlot(0, 0, 'sample-item-3');
      });

      it('resets selectedPlantableItemId state', () => {
        expect(component.state().selectedPlantableItemId).toEqual('');
      });
    });
  });

  describe('waterPlot', () => {
    beforeEach(() => {
      component.setState({
        field: [[testCrop({ itemId: 'sample-item-1' })]],
      });

      component.instance().waterPlot(0, 0);
    });

    it('sets wasWateredToday to true', () => {
      expect(component.state().field[0][0].wasWateredToday).toBe(true);
    });
  });
});
