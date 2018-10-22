/* eslint-disable import/first */
jest.mock('./data/maps');
jest.mock('./data/items');

import React from 'react';
import { shallow } from 'enzyme';
import { testCrop, testItem } from './test-utils';
import { initialFieldWidth, initialFieldHeight } from './constants';
import { sampleItem1, sampleItem2, sampleItem3 } from './data/items';

import App, {
  computePlayerInventory,
  getPlantableInventory,
  getUpdatedValueAdjustments,
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
    let incrementCropAgesSpy;

    beforeEach(() => {
      mathSpy = jest.spyOn(Math, 'random').mockImplementation(() => 0.75);
      incrementCropAgesSpy = jest.spyOn(
        component.instance(),
        'incrementCropAges'
      );
      component.instance().incrementDay();
    });

    afterEach(() => {
      mathSpy.mockRestore();
      incrementCropAgesSpy.mockRestore();
    });

    it('updates component state', () => {
      const { dayCount, valueAdjustments } = component.state();

      expect(dayCount).toEqual(2);
      expect(valueAdjustments['sample-item-1']).toEqual(1.25);
      expect(valueAdjustments['sample-item-2']).toEqual(1.25);
      expect(incrementCropAgesSpy.mock.calls.length).toEqual(1);
    });
  });

  describe('incrementCropAge', () => {
    it('updates daysOld', () => {
      expect(
        component
          .instance()
          .incrementCropAge(testCrop({ itemId: 'sample-item-1' })).daysOld
      ).toBe(1);
    });
  });

  describe('incrementCropAges', () => {
    beforeEach(() => {
      component.setState({
        field: [
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
        ],
      });
    });

    it('update daysOld across all crops', () => {
      expect(component.instance().incrementCropAges()).toEqual([
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
});
