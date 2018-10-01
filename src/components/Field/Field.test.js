import React from 'react';
import Field from './Field';
import { shallow } from 'enzyme';
import assert from 'assert';

let component;

const getField = props => <Field {...{ columns: 0, rows: 0, ...props }} />;

describe('table rendering', () => {
  beforeEach(() => {
    component = shallow(getField({ columns: 2, rows: 3 }));
  });

  it('renders rows', () => {
    assert.equal(component.find('tr').length, 3);
  });

  it('renders columns', () => {
    assert.equal(
      component
        .find('tr')
        .at(0)
        .find('td').length,
      2
    );
  });
});
