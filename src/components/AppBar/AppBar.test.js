import React from 'react';
import { shallow } from 'enzyme';

import { stageFocusType } from '../../enums';

import AppBar from './AppBar';

let component;

beforeEach(() => {
  component = shallow(
    <AppBar
      {...{
        handleClickNextMenuButton: () => {},
        handleClickPreviousMenuButton: () => {},
        handleMenuToggle: () => {},
        money: 0,
        stageFocus: stageFocusType.FIELD,
      }}
    />
  );
});

it('renders', () => {
  expect(component).toHaveLength(1);
});
