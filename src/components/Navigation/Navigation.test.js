import React from 'react';
import { shallow } from 'enzyme';

import { stageFocusType } from '../../enums';

import { Navigation } from './Navigation';

let component;

beforeEach(() => {
  component = shallow(
    <Navigation
      {...{
        dayCount: 0,
        handleViewChange: () => {},
        purchasedCowPen: 0,
        stageFocus: stageFocusType.FIELD,
      }}
    />
  );
});

test('renders', () => {
  expect(component.hasClass('Navigation')).toBeTruthy();
});

// TODO: Test cow pen rendering
