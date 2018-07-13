import React from 'react';
import { Farmhand } from '../src/index';
import Stage from '../src/stage';
import Inventory from '../src/inventory';
import {
  stageFocus
} from '../src/enums';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import assert from 'assert';

import { initialFieldWidth, initialFieldHeight } from '../src/constants';

// TODO: Separate component tests into separate files

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

describe('stage', () => {
  describe('focus', () => {
    beforeEach(() => {
      component = shallow(<Stage focusType={stageFocus.INVENTORY} />);
    });

    it('shows the inventory', () => {
      assert.equal(component.find(Inventory).length, 1);
    });
  });
});
