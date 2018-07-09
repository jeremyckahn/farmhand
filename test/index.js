import React from 'react';
import { Farmhand } from '../src/index';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import assert from 'assert';

Enzyme.configure({ adapter: new Adapter() });

let component;

describe('Farmhand', () => {
  beforeEach(() => {
    component = shallow(<Farmhand />);
  });

  describe('dom', () => {
    it('renders content', () => {
      assert.equal(component.find('div').length, 1);
    });
  });
});
