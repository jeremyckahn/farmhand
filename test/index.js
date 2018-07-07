import React from 'react';
import { App } from '../src/index';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import assert from 'assert';

Enzyme.configure({ adapter: new Adapter() });

let component;

describe('App', () => {
  beforeEach(() => {
    component = shallow(<App />);
  });

  describe('dom', () => {
    it('renders content', () => {
      assert.equal(component.find('div').length, 1);
    });
  });
});
