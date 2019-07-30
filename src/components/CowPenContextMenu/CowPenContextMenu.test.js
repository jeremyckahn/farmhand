import React from 'react';
import { shallow } from 'enzyme';
import Button from '@material-ui/core/Button';

import { generateCow } from '../../utils';
import { PURCHASEABLE_COW_PENS } from '../../constants';
import { cowColors } from '../../enums';

import { CowCard } from './CowPenContextMenu';

describe('cow card rendering', () => {
  let subcomponent;

  describe('cow purchase button', () => {
    beforeEach(() => {
      subcomponent = shallow(
        <CowCard
          {...{
            cow: {
              color: cowColors.WHITE,
              name: '',
              weight: 100,
            },
            cowInventory: [],
            handleCowNameInputChange: () => {},
            handleCowPurchaseClick: () => {},
            money: 0,
            purchasedCowPen: 1,
          }}
        />
      );
    });

    describe('player does not have enough money', () => {
      describe('cow pen has no space', () => {
        test('button is disabled', () => {
          subcomponent.setProps({
            money: 100,
          });

          expect(subcomponent.find(Button).props().disabled).toBe(true);
        });
      });

      describe('cow pen has space', () => {
        test('button is disabled', () => {
          subcomponent.setProps({
            money: 100,
          });

          expect(subcomponent.find(Button).props().disabled).toBe(true);
        });
      });
    });

    describe('player has enough money', () => {
      describe('cow pen has no space', () => {
        test('button is disabled', () => {
          const cowCapacity = PURCHASEABLE_COW_PENS.get(1).cows;
          subcomponent.setProps({
            money: 150,
            cowInventory: Array(cowCapacity)
              .fill(null)
              .map(() => generateCow()),
          });

          expect(subcomponent.find(Button).props().disabled).toBe(true);
        });
      });

      describe('cow pen has space', () => {
        test('button is not disabled', () => {
          subcomponent.setProps({
            money: 150,
          });

          expect(subcomponent.find(Button).props().disabled).toBe(false);
        });
      });
    });
  });
});
