import React from 'react';
import Stage from '../../src/stage';
import Inventory from '../../src/inventory';
import {
  stageFocus
} from '../../src/enums';
import { shallow } from 'enzyme';
import assert from 'assert';

let component;

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
