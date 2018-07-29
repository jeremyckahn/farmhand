import React from 'react';
import Farmhand from '../../src/components/farmhand';
import { shallow } from 'enzyme';
import assert from 'assert';
import { carrotSeeds, pumpkinSeeds } from '../../src/data/items';

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

  describe('getPlayerInventory', () => {
    let playerInventory;

    beforeEach(() => {
      component.setState({
        inventory: [{ quantity: 1, itemId: 'carrot-seeds' }],
      });

      playerInventory = component.instance().getPlayerInventory();
    });

    it('maps inventory state to renderable inventory data', () => {
      assert.deepEqual(playerInventory, [
        Object.assign({ quantity: 1 }, carrotSeeds),
      ]);
    });

    it('returns cached result with unchanged input', () => {
      const newPlayerInventory = component.instance().getPlayerInventory();
      assert.equal(playerInventory, newPlayerInventory);
    });

    it('invalidates cache with changed input', () => {
      component.setState({
        inventory: [{ quantity: 2, itemId: 'pumpkin-seeds' }],
      });

      playerInventory = component.instance().getPlayerInventory();
      assert.deepEqual(playerInventory, [
        Object.assign({ quantity: 2 }, pumpkinSeeds),
      ]);
    });
  });
});
