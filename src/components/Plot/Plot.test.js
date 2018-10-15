import React from 'react';
import Plot from './Plot';
import { shallow } from 'enzyme';
import assert from 'assert';

let component;

const getPlot = props => (
  <Plot
    {...{
      handlers: { handlePlotClick: () => {} },
      x: 0,
      y: 0,
      state: {},
      ...props,
    }}
  />
);

beforeEach(() => {
  component = shallow(getPlot());
});

it('renders', () => {
  assert.equal(component.length, 1);
});
