/* eslint-disable import/first */
jest.mock('./data/maps');

import { getCropId } from './utils';

describe('getCropId', () => {
  it('returns an ID for a provided crop', () => {
    expect(getCropId({ itemId: 'sample-crop-1' })).toBe('sample');
  });
});
