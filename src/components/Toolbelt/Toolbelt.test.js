import React from 'react';
import Toolbelt from './Toolbelt';
import { shallow } from 'enzyme';
import { toolType } from '../../enums';

let component;

const getToolbelt = (props = {}) => (
  <Toolbelt
    {...{
      handlers: { handleToolSelect: () => {}, ...props.handlers },
      state: {
        selectedTool: toolType.NONE,
        ...props.state,
      },
      ...props.options,
    }}
  />
);

beforeEach(() => {
  component = shallow(getToolbelt());
});

it('renders shop inventory', () => {
  expect(component.length).toEqual(1);
});

describe('tool selection', () => {
  it('selects no tools by default', () => {
    expect(component.find('.selected').length).toEqual(0);
  });

  describe('a tool is selected', () => {
    beforeEach(() => {
      component = shallow(
        getToolbelt({ state: { selectedTool: toolType.WATERING_CAN } })
      );
    });

    it('renders selected tool appropriately', () => {
      expect(component.find('.selected').find('.watering-can').length).toEqual(
        1
      );
    });
  });
});
