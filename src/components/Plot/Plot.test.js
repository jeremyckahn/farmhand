/* eslint-disable import/first */
jest.mock('../../img');

import React from 'react';
import Plot from './Plot';
import { shallow } from 'enzyme';
import { testItem } from '../../test-utils';
import { items } from '../../img';
import pixel from '../../img/pixel.png';

let component;

const getPlot = (props = {}) => (
  <Plot
    {...{
      handlers: { handlePlotClick: () => {}, ...props.handlers },
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

it('renders provided item', () => {
  component = shallow(
    getPlot({ options: { item: testItem({ itemId: 'sample-item-1' }) } })
  );

  expect(component.find('img').props().style.backgroundImage).toBe(
    `url(${items['sample-item-1']})`
  );
});
