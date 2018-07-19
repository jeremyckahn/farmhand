import React from 'react';
import Farmhand from '../../src/farmhand';
import { shallow } from 'enzyme';
import assert from 'assert';

import { initialFieldWidth, initialFieldHeight } from '../../src/constants';

let component;

describe('Farmhand', () => {
  beforeEach(() => {
    component = shallow(<Farmhand />);
  });

  describe('state', () => {
    it('inits field', () => {
      assert.equal(component.state().field.length, initialFieldHeight);
      assert.equal(component.state().field[0].length, initialFieldWidth);
    });
  });
});
