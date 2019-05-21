import React from 'react';
import { Navigation } from './Navigation';
import { shallow } from 'enzyme';
import { stageFocusType } from '../../enums';

let component;

beforeEach(() => {
  component = shallow(
    <Navigation
      {...{
        handleViewChange: () => {},
        stageFocus: stageFocusType.FIELD,
      }}
    />
  );
});

test('renders', () => {
  expect(component.hasClass('Navigation')).toBeTruthy();
});
