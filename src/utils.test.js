import {
  dollarAmount,
  generateCow,
  getCowValue,
  getCropId,
  getCropLifeStage,
  getLifeStageRange,
  getPlotContentFromItemId,
  getPlotImage,
  getRangeCoords,
} from './utils';
import fruitNames from './data/fruit-names';
import { testCrop } from './test-utils';
import { items as itemImages } from './img';
import { cowColors, cropLifeStage, genders } from './enums';
import {
  COW_STARTING_WEIGHT_BASE,
  COW_STARTING_WEIGHT_VARIANCE,
} from './constants';

jest.mock('./data/maps');
jest.mock('./data/items');
jest.mock('./img');

const { SEED, GROWING, GROWN } = cropLifeStage;

describe('dollarAmount', () => {
  test('formats number to dollar amount', () => {
    expect(dollarAmount(123.4567)).toEqual('123.46');
  });
});

describe('generateCow', () => {
  describe('randomizer: lower bound', () => {
    beforeEach(() => {
      jest.spyOn(Math, 'random').mockReturnValue(0);
    });

    test('generates a cow', () => {
      const weight = COW_STARTING_WEIGHT_BASE - COW_STARTING_WEIGHT_VARIANCE;
      expect(generateCow()).toMatchObject({
        color: Object.keys(cowColors)[0],
        daysOld: 0,
        gender: Object.keys(genders)[0],
        name: fruitNames[0],
        weight,
      });
    });
  });

  describe('randomizer: upper bound', () => {
    beforeEach(() => {
      jest.spyOn(Math, 'random').mockReturnValue(1);
    });

    test('generates a cow', () => {
      const weight = COW_STARTING_WEIGHT_BASE + COW_STARTING_WEIGHT_VARIANCE;

      expect(generateCow()).toMatchObject({
        color: Object.keys(cowColors).pop(),
        daysOld: 0,
        gender: Object.keys(genders).pop(),
        name: fruitNames[fruitNames.length - 1],
        weight,
      });
    });
  });
});

describe('getCowValue', () => {
  test('computes cow value', () => {
    expect(getCowValue({ weight: 100 })).toEqual(150);
  });
});

describe('getCropId', () => {
  test('returns an ID for a provided crop', () => {
    expect(getCropId({ itemId: 'sample-crop-1' })).toBe('sample-crop-type-1');
  });
});

describe('getLifeStageRange', () => {
  test('converts a cropTimetable to an array of stages', () => {
    expect(getLifeStageRange({ [SEED]: 1, [GROWING]: 2 })).toEqual([
      SEED,
      GROWING,
      GROWING,
    ]);
  });
});

describe('getCropLifeStage', () => {
  test('maps a life cycle label to an image name chunk', () => {
    const itemId = 'sample-crop-1';

    expect(getCropLifeStage({ itemId, daysWatered: 0 })).toBe(SEED);
    expect(getCropLifeStage({ itemId, daysWatered: 1.5 })).toBe(GROWING);
    expect(getCropLifeStage({ itemId, daysWatered: 3 })).toBe(GROWN);
  });
});

describe('getPlotImage', () => {
  test('returns null when no plotContent is provided', () => {
    expect(getPlotImage(null)).toBe(null);
  });

  test('returns a plot images for a crop', () => {
    const itemId = 'sample-crop-1';

    expect(getPlotImage(testCrop({ itemId, daysWatered: 0 }))).toBe(
      itemImages['sample-crop-type-1-seed']
    );
    expect(getPlotImage(testCrop({ itemId, daysWatered: 1 }))).toBe(
      itemImages['sample-crop-type-1-growing']
    );
    expect(getPlotImage(testCrop({ itemId, daysWatered: 3 }))).toBe(
      itemImages['sample-crop-type-1']
    );
  });

  test('returns item image for non-crop content', () => {
    expect(getPlotImage(getPlotContentFromItemId('sprinkler'))).toBe(
      itemImages['sprinkler']
    );
  });
});

describe('getRangeCoords', () => {
  describe('surrounded by plots', () => {
    test('computes the plot range', () => {
      expect(getRangeCoords(1, 1, 1)).toEqual([
        [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
        [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
        [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
      ]);
    });
  });

  describe('edge testing', () => {
    test('in-range plots below field bounds are negative', () => {
      expect(getRangeCoords(1, 0, 0)).toEqual([
        [{ x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 }],
        [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }],
        [{ x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
      ]);
    });
  });
});
