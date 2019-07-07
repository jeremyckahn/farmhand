import React from 'react';
import { shallow } from 'enzyme';

import { CowPenContextMenu } from './CowPenContextMenu';

let component;

beforeEach(() => {
  component = shallow(
    <CowPenContextMenu
      {...{
        cowForSale: {
          name: '',
          weight: 0,
        },
        handleCowPurchaseClick: () => {},
        money: 0,
      }}
    />
  );
});

test('renders', () => {
  expect(component).toHaveLength(1);
});
