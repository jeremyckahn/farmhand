import React from 'react';
import Field from './Field';
import Plot from '../Plot';
import { shallow } from 'enzyme';
import assert from 'assert';

let component;

const getField = props => (
  <Field {...{ columns: 0, handlePlotClick: () => {}, rows: 0, ...props }} />
);

describe('table rendering', () => {
  beforeEach(() => {
    component = shallow(getField({ columns: 2, rows: 3 }));
  });

  it('renders rows', () => {
    assert.equal(component.find('.row').length, 3);
  });

  it('renders columns', () => {
    assert.equal(
      component
        .find('.row')
        .at(0)
        .find(Plot).length,
      2
    );
  });
});
