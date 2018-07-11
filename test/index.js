import React from 'react';
import { Farmhand } from '../src/index';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import assert from 'assert';

import { initialFieldWidth, initialFieldHeight } from '../src/constants';

Enzyme.configure({ adapter: new Adapter() });

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
