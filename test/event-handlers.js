import React from 'react';
import Farmhand from '../src/components/farmhand';
import { stageFocusType } from '../src/enums';
import { shallow } from 'enzyme';
import assert from 'assert';
import { testItem } from './test-utils';

let component;

const handlers = () => component.instance().handlers;

describe('event handlers', () => {
  beforeEach(() => {
    component = shallow(<Farmhand />);
  });

  describe('handlePurchaseItem', () => {
    describe('user has enough money', () => {
      it('creates a new item in the inventory', () => {
        handlers().handlePurchaseItem(testItem({ id: 'carrot-seeds' }));
        assert.deepEqual(component.state().inventory, [
          { id: 'carrot-seeds', quantity: 1 },
        ]);
      });

      describe('existing items', () => {
        beforeEach(() => {
          component.setState({
            inventory: [testItem({ id: 'carrot-seeds', quantity: 1 })],
          });
        });

        it('increments an existing item in the inventory', () => {
          handlers().handlePurchaseItem(testItem({ id: 'carrot-seeds' }));

          assert.deepEqual(component.state().inventory, [
            testItem({
              id: 'carrot-seeds',
              quantity: 2,
            }),
          ]);
        });
      });

      describe('money state', () => {
        beforeEach(() => {
          component.setState({ money: 100 });
          handlers().handlePurchaseItem(
            testItem({ id: 'carrot-seeds', value: 10 })
          );
        });

        it('deducts item value from money', () => {
          assert.equal(component.state('money'), 90);
        });
      });
    });

    describe('user does not have enough money', () => {
      beforeEach(() => {
        component.setState({ money: 5 });
        handlers().handlePurchaseItem(
          testItem({ id: 'expensive-item', value: 10 })
        );
      });

      it('does not add the item to the inventory', () => {
        assert.deepEqual(component.state('inventory'), {});
      });

      it('does not deduct item value from money', () => {
        assert.equal(component.state('money'), 5);
      });
    });
  });

  xdescribe('handleSellItem', () => {});

  describe('handleChangeView', () => {
    beforeEach(() => {
      handlers().handleChangeView({ target: { value: stageFocusType.SHOP } });
    });

    it('changes the view type', () => {
      assert.equal(component.state('stageFocus'), stageFocusType.SHOP);
    });
  });
});
