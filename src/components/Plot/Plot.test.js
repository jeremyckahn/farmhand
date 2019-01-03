import React from 'react';
import Plot, { getBackgroundStyles } from './Plot';
import { shallow } from 'enzyme';
import { testCrop } from '../../test-utils';
import { pixel, fertilizedPlot, wateredPlot } from '../../img';
import { cropLifeStage } from '../../enums';

jest.mock('../../img');

let component;

const getPlot = (props = {}) => (
  <Plot
    {...{
      handlers: { handlePlotClick: () => {}, ...props.handlers },
      lifeStage: cropLifeStage.SEED,
      x: 0,
      y: 0,
      state: { ...props.state },
      ...props.options,
    }}
  />
);

beforeEach(() => {
  component = shallow(getPlot());
});

it('defaults to rending a pixel', () => {
  expect(component.find('img').props().src).toBe(pixel);
});

it('does not render crop class', () => {
  expect(component.hasClass('crop')).toBeFalsy();
});

it('renders "is-fertilized" class', () => {
  component = shallow(getPlot({ options: { crop: { isFertilized: true } } }));
  expect(component.hasClass('is-fertilized')).toBeTruthy();
});

it('renders "ripe" class', () => {
  component = shallow(getPlot({ options: { lifeStage: cropLifeStage.GROWN } }));
  expect(component.hasClass('ripe')).toBeTruthy();
});

it('renders provided image data', () => {
  const image = 'data:image/png;base64,some-other-image';

  component = shallow(
    getPlot({
      options: {
        image,
        crop: testCrop({ itemId: 'sample-crop-1' }),
      },
    })
  );

  expect(component.find('img').props().style.backgroundImage).toBe(
    `url(${image})`
  );
});

describe('background image', () => {
  it('renders pixel', () => {
    expect(component.find('.Plot').props().style.backgroundImage).toBe(null);
  });

  it('renders wateredPlot image', () => {
    component = shallow(
      getPlot({
        options: {
          crop: testCrop({ itemId: 'sample-crop-1', wasWateredToday: true }),
        },
      })
    );

    expect(component.find('.Plot').props().style.backgroundImage).toBe(
      `url(${wateredPlot})`
    );
  });
});

describe('getBackgroundStyles', () => {
  test('returns null for !crop', () => {
    expect(getBackgroundStyles()).toBe(null);
  });

  test('constructs style for isFertilized', () => {
    expect(getBackgroundStyles(testCrop({ isFertilized: true }))).toBe(
      `url(${fertilizedPlot})`
    );
  });

  test('constructs style for wasWateredToday', () => {
    expect(getBackgroundStyles(testCrop({ wasWateredToday: true }))).toBe(
      `url(${wateredPlot})`
    );
  });

  test('constructs style for isFertilized and wasWateredToday', () => {
    expect(
      getBackgroundStyles(
        testCrop({ isFertilized: true, wasWateredToday: true })
      )
    ).toBe(`url(${fertilizedPlot}), url(${wateredPlot})`);
  });
});
