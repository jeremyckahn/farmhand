import React from 'react';
import { shallow } from 'enzyme';

import Kitchen from './Kitchen';

let component;

beforeEach(() => {
  component = shallow(<Kitchen {...{}} />);
});

test('renders', () => {
  expect(component).toHaveLength(1);
});
