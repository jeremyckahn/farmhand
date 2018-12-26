import {
  getCropId,
  getCropLifeStage,
  getLifeStageRange,
  getPlotImage,
} from './utils';
import { items as itemImages } from './img';
import { cropLifeStage } from './enums';

jest.mock('./data/maps');
jest.mock('./data/items');
jest.mock('./img');

const { SEED, GROWING, GROWN } = cropLifeStage;

describe('getCropId', () => {
  it('returns an ID for a provided crop', () => {
    expect(getCropId({ itemId: 'sample-crop-1' })).toBe('sample-crop-type-1');
  });
});

describe('getLifeStageRange', () => {
  it('converts a cropTimetable to an array of stages', () => {
    expect(getLifeStageRange({ [SEED]: 1, [GROWING]: 2 })).toEqual([
      SEED,
      GROWING,
      GROWING,
    ]);
  });
});

describe('getCropLifeStage', () => {
  it('maps a life cycle label to an image name chunk', () => {
    const itemId = 'sample-crop-1';

    expect(getCropLifeStage({ itemId, daysWatered: 0 })).toBe(SEED);
    expect(getCropLifeStage({ itemId, daysWatered: 1 })).toBe(GROWING);
    expect(getCropLifeStage({ itemId, daysWatered: 3 })).toBe(GROWN);
  });
});

describe('getPlotImage', () => {
  it('returns null when no crop is provided', () => {
    expect(getPlotImage(null)).toBe(null);
  });

  it('returns a plot images for a crop', () => {
    const itemId = 'sample-crop-1';

    expect(getPlotImage({ itemId, daysWatered: 0 })).toBe(
      itemImages['sample-crop-type-1-seed']
    );
    expect(getPlotImage({ itemId, daysWatered: 1 })).toBe(
      itemImages['sample-crop-type-1-growing']
    );
    expect(getPlotImage({ itemId, daysWatered: 3 })).toBe(
      itemImages['sample-crop-type-1']
    );
  });
});
