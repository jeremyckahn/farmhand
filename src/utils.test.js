/* eslint-disable import/first */
jest.mock('./data/maps');
jest.mock('./data/items');
jest.mock('./img');

import {
  getCropId,
  getCropLifeStage,
  getLifestageRange,
  getLifeStageImageId,
  getPlotImage,
} from './utils';
import { items as itemImages } from './img';

describe('getCropId', () => {
  it('returns an ID for a provided crop', () => {
    expect(getCropId({ itemId: 'sample-crop-1' })).toBe('sample-crop-type-1');
  });
});

describe('getLifestageRange', () => {
  it('converts a cropTimetable to an array of stages', () => {
    expect(getLifestageRange({ seed: 1, growing: 2 })).toEqual([
      'seed',
      'growing',
      'growing',
    ]);
  });
});

describe('getCropLifeStage', () => {
  const cropTimetable = { seed: 1, growing: 2 };

  it('gets corrent life stage for index', () => {
    expect(getCropLifeStage({ cropTimetable }, 2)).toBe('growing');
  });

  it('defaults to "grown"', () => {
    expect(getCropLifeStage({ cropTimetable }, 6)).toBe('grown');
  });
});

describe('getLifeStageImageId', () => {
  it('maps a life cycle label to an image name chunk', () => {
    const itemId = 'sample-crop-1';

    expect(getLifeStageImageId({ itemId, daysWatered: 0 })).toBe('seed');
    expect(getLifeStageImageId({ itemId, daysWatered: 1 })).toBe('growing');
    expect(getLifeStageImageId({ itemId, daysWatered: 3 })).toBe('grown');
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
