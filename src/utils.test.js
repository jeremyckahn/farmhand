import {
  getCropId,
  getCropLifeStage,
  getLifeStageRange,
  getPlotContentFromItemId,
  getPlotImage,
  getRangeCoords,
} from './utils';
import { testCrop } from './test-utils';
import { items as itemImages } from './img';
import { cropLifeStage } from './enums';

jest.mock('./data/maps');
jest.mock('./data/items');
jest.mock('./img');

const { SEED, GROWING, GROWN } = cropLifeStage;

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
