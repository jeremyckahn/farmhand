import React from 'react';
import { shallow } from 'enzyme';
import Button from '@material-ui/core/Button';

import { generateCow } from '../../utils';
import { PURCHASEABLE_COW_PENS } from '../../constants';

import { CowPenContextMenu } from './CowPenContextMenu';

let component;

beforeEach(() => {
  component = shallow(
    <CowPenContextMenu
      {...{
        cowForSale: {
          name: '',
          weight: 100,
        },
        cowInventory: [],
        handleCowPurchaseClick: () => {},
        money: 0,
        purchasedCowPen: 1,
      }}
    />
  );
});

describe('cow purchase button', () => {
  describe('player does not have enough money', () => {
    describe('cow pen has no space', () => {
      test('button is disabled', () => {
        const cowCapacity = PURCHASEABLE_COW_PENS.get(1).cows;
        component.setProps({
          money: 100,
          cowInventory: Array(cowCapacity)
            .fill(null)
            .map(() => generateCow()),
        });

        expect(component.find(Button).props().disabled).toBe(true);
      });
    });

    describe('cow pen has space', () => {
      test('button is disabled', () => {
        component.setProps({
          money: 100,
        });

        expect(component.find(Button).props().disabled).toBe(true);
      });
    });
  });

  describe('player has enough money', () => {
    describe('cow pen has no space', () => {
      test('button is disabled', () => {
        const cowCapacity = PURCHASEABLE_COW_PENS.get(1).cows;
        component.setProps({
          money: 150,
          cowInventory: Array(cowCapacity)
            .fill(null)
            .map(() => generateCow()),
        });

        expect(component.find(Button).props().disabled).toBe(true);
      });
    });

    describe('cow pen has space', () => {
      test('button is not disabled', () => {
        component.setProps({
          money: 150,
        });

        expect(component.find(Button).props().disabled).toBe(false);
      });
    });
  });
});
