import React from 'react';
import { Toolbelt } from './Toolbelt';
import { shallow } from 'enzyme';
import { fieldMode } from '../../enums';

let component;

beforeEach(() => {
  component = shallow(
    <Toolbelt
      {...{
        handleFieldModeSelect: () => {},
        fieldMode: fieldMode.OBSERVE,
      }}
    />
  );
});

test('renders shop inventory', () => {
  expect(component).toHaveLength(1);
});

describe('tool selection', () => {
  test('selects no tools by default', () => {
    expect(component.find('.selected')).toHaveLength(0);
  });

  describe('a tool is selected', () => {
    beforeEach(() => {
      component.setProps({ fieldMode: fieldMode.WATER });
    });

    test('renders selected tool appropriately', () => {
      expect(component.find('.selected').find('.watering-can')).toHaveLength(1);
    });
  });
});
