import React from 'react';
import { shallow } from 'enzyme';

import { CowPen } from './CowPen';

let component;

beforeEach(() => {
  component = shallow(<CowPen {...{}} />);
});

test('renders', () => {
  expect(component).toHaveLength(1);
});
