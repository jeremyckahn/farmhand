import React from 'react';
import { shallow } from 'enzyme';

import { CowPenContextMenu } from './CowPenContextMenu';

let component;

beforeEach(() => {
  component = shallow(<CowPenContextMenu {...{}} />);
});

test('renders', () => {
  expect(component).toHaveLength(1);
});
