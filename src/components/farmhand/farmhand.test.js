/* eslint-disable import/first */
jest.mock('../../data/maps');
jest.mock('../../data/items');

import React from 'react';
import { shallow } from 'enzyme';
import assert from 'assert';
import { stub } from 'sinon';
import { testItem } from '../../test-utils';
import { initialFieldWidth, initialFieldHeight } from '../../constants';
import { sampleItem1, sampleItem2 } from '../../data/items';

import Farmhand, {
  computePlayerInventory,
  getUpdatedValueAdjustments,
} from './farmhand';

let component;
let mathStub;

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

  describe('private functions', () => {
    describe('computePlayerInventory', () => {
      let playerInventory;
      let inventory;
      let valueAdjustments;

      beforeEach(() => {
        inventory = [{ quantity: 1, id: 'sample-item-1' }];
        valueAdjustments = {};
        playerInventory = computePlayerInventory(inventory, valueAdjustments);
      });

      it('maps inventory state to renderable inventory data', () => {
        assert.deepEqual(playerInventory, [{ quantity: 1, ...sampleItem1 }]);
      });

      it('returns cached result with unchanged input', () => {
        const newPlayerInventory = computePlayerInventory(
          inventory,
          valueAdjustments
        );
        assert.equal(playerInventory, newPlayerInventory);
      });

      it('invalidates cache with changed input', () => {
        playerInventory = computePlayerInventory(
          [{ quantity: 1, id: 'sample-item-2' }],
          valueAdjustments
        );
        assert.deepEqual(playerInventory, [{ quantity: 1, ...sampleItem2 }]);
      });

      describe('with valueAdjustments', () => {
        beforeEach(() => {
          valueAdjustments = {
            'sample-item-1': 2,
          };

          playerInventory = computePlayerInventory(inventory, valueAdjustments);
        });

        it('maps inventory state to renderable inventory data', () => {
          assert.deepEqual(playerInventory, [
            { quantity: 1, ...testItem({ id: 'sample-item-1', value: 2 }) },
          ]);
        });
      });
    });

    describe('getUpdatedValueAdjustments', () => {
      let valueAdjustments;

      beforeEach(() => {
        mathStub = stub(Math, 'random').returns(1);
        valueAdjustments = getUpdatedValueAdjustments();
      });

      afterEach(() => {
        mathStub.restore();
      });

      it('updates valueAdjustments by random factor', () => {
        assert.deepEqual(valueAdjustments, {
          'sample-item-1': 1.5,
          'sample-item-2': 1.5,
        });
      });
    });
  });

  describe('instance methods', () => {
    describe('proceedDay', () => {
      beforeEach(() => {
        mathStub = stub(Math, 'random').returns(0.75);
        component.instance().proceedDay();
      });

      afterEach(() => {
        mathStub.restore();
      });

      it('updates component state', () => {
        const { dayCount, valueAdjustments } = component.state();

        assert.equal(dayCount, 2);
        assert.deepEqual(valueAdjustments, {
          'sample-item-1': 1.25,
          'sample-item-2': 1.25,
        });
      });
    });
  });
});
