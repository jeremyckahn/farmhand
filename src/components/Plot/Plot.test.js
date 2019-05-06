import React from 'react';
import { Plot, isInRange, getBackgroundStyles } from './Plot';
import { shallow } from 'enzyme';
import { getPlotContentFromItemId } from '../../utils';
import { testCrop } from '../../test-utils';
import { pixel, plotStates } from '../../img';
import { cropLifeStage } from '../../enums';

jest.mock('../../data/maps');
jest.mock('../../data/items');
jest.mock('../../img');

let component;

beforeEach(() => {
  component = shallow(
    <Plot
      {...{
        handlePlotClick: () => {},
        handlePlotMouseOver: () => {},
        hoveredPlotRange: [[]],
        lifeStage: cropLifeStage.SEED,
        x: 0,
        y: 0,
      }}
    />
  );
});

test('defaults to rending a pixel', () => {
  expect(component.find('img').props().src).toBe(pixel);
});

test('renders empty class', () => {
  expect(component.hasClass('is-empty')).toBeTruthy();
});

test('renders crop class', () => {
  component.setProps({ plotContent: testCrop({ itemId: 'sample-crop-1' }) });
  expect(component.hasClass('crop')).toBeTruthy();
});

test('renders is-replantable class', () => {
  component.setProps({
    plotContent: getPlotContentFromItemId('replantable-item'),
  });
  expect(component.hasClass('is-replantable')).toBeTruthy();
});

test('renders "is-fertilized" class', () => {
  component.setProps({
    plotContent: testCrop({ itemId: 'sample-crop-1', isFertilized: true }),
  });
  expect(component.hasClass('is-fertilized')).toBeTruthy();
});

test('renders "is-ripe" class', () => {
  component.setProps({ lifeStage: cropLifeStage.GROWN });
  expect(component.hasClass('is-ripe')).toBeTruthy();
});

test('renders provided image data', () => {
  const image = 'data:image/png;base64,some-other-image';

  component.setProps({
    image,
    plotContent: testCrop({ itemId: 'sample-crop-1' }),
  });

  expect(component.find('img').props().style.backgroundImage).toBe(
    `url(${image})`
  );
});

describe('background image', () => {
  test('renders pixel', () => {
    expect(component.find('.Plot').props().style.backgroundImage).toBe(null);
  });

  test('renders wateredPlot image', () => {
    component.setProps({
      plotContent: testCrop({
        itemId: 'sample-crop-1',
        wasWateredToday: true,
      }),
    });

    expect(component.find('.Plot').props().style.backgroundImage).toBe(
      `url(${plotStates['watered-plot']})`
    );
  });
});

describe('getBackgroundStyles', () => {
  test('returns null for !plotContent', () => {
    expect(getBackgroundStyles()).toBe(null);
  });

  test('constructs style for isFertilized', () => {
    expect(getBackgroundStyles(testCrop({ isFertilized: true }))).toBe(
      `url(${plotStates['fertilized-plot']})`
    );
  });

  test('constructs style for wasWateredToday', () => {
    expect(getBackgroundStyles(testCrop({ wasWateredToday: true }))).toBe(
      `url(${plotStates['watered-plot']})`
    );
  });

  test('constructs style for isFertilized and wasWateredToday', () => {
    expect(
      getBackgroundStyles(
        testCrop({ isFertilized: true, wasWateredToday: true })
      )
    ).toBe(
      `url(${plotStates['fertilized-plot']}), url(${
        plotStates['watered-plot']
      })`
    );
  });
});

describe('isInRange', () => {
  const range = [
    [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
    [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
    [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
  ];

  test('provided coordinates are in range', () => {
    expect(isInRange(range, 1, 1)).toBeTruthy();
  });

  test('provided coordinates are out of range', () => {
    expect(isInRange(range, 3, 3)).toBeFalsy();
  });
});
