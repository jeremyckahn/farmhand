import React from 'react';
import Farmhand from './Farmhand';
import { stageFocusType, fieldMode } from './enums';
import { shallow } from 'enzyme';
import { testItem } from './test-utils';

jest.mock('./data/items');

let component;

const handlers = () => component.instance().handlers;

beforeEach(() => {
  component = shallow(<Farmhand />);
});

describe('handleItemPurchase', () => {
  test('calls purchaseItem', () => {
    jest
      .spyOn(component.instance(), 'purchaseItem')
      .mockImplementation(() => {});
    handlers().handleItemPurchase(testItem({ id: 'sample-item-1' }));

    expect(component.instance().purchaseItem).toHaveBeenCalledWith(
      testItem({ id: 'sample-item-1' })
    );
  });
});

describe('handleItemSell', () => {
  test('calls sellItem', () => {
    jest.spyOn(component.instance(), 'sellItem').mockImplementation(() => {});
    handlers().handleItemSell(testItem({ id: 'sample-item-1' }));

    expect(component.instance().sellItem).toHaveBeenCalledWith(
      testItem({ id: 'sample-item-1' })
    );
  });
});

describe('handleViewChange', () => {
  beforeEach(() => {
    handlers().handleViewChange({ target: { value: stageFocusType.SHOP } });
  });

  test('changes the view type', () => {
    expect(component.state('stageFocus')).toEqual(stageFocusType.SHOP);
  });
});

describe('handleFieldModeSelect', () => {
  beforeEach(() => {
    component.setState({
      selectedItemId: 'sample-crop-3',
    });
  });

  describe('fieldMode === PLANT', () => {
    beforeEach(() => {
      handlers().handleFieldModeSelect(fieldMode.PLANT);
    });

    test('updates fieldMode state', () => {
      expect(component.state().fieldMode).toEqual(fieldMode.PLANT);
    });

    test('does not change state.selectedItemId', () => {
      expect(component.state().selectedItemId).toEqual('sample-crop-3');
    });
  });

  describe('fieldMode !== PLANT', () => {
    beforeEach(() => {
      handlers().handleFieldModeSelect(fieldMode.WATER);
    });

    test('updates fieldMode state', () => {
      expect(component.state().fieldMode).toEqual(fieldMode.WATER);
    });

    test('resets state.selectedItemId', () => {
      expect(component.state().selectedItemId).toEqual('');
    });
  });
});

describe('handleItemSelect', () => {
  beforeEach(() => {
    component.setState({
      selectedItemId: 'sample-crop-1',
    });

    handlers().handleItemSelect(
      testItem({ enablesFieldMode: 'FOO', id: 'field-tool' })
    );
  });

  test('resets state.selectedItemId', () => {
    expect(component.state().selectedItemId).toEqual('field-tool');
  });

  test('sets state.fieldMode', () => {
    expect(component.state().fieldMode).toEqual('FOO');
  });
});

describe('handlePlotClick', () => {
  beforeEach(() => {
    component.setState({
      selectedItemId: 'sample-crop-3',
    });
  });

  describe('fieldMode === fieldMode.PLANT', () => {
    beforeEach(() => {
      component.setState({
        fieldMode: fieldMode.PLANT,
        selectedItemId: 'sample-crop-3',
      });
    });

    test('calls plantInPlot', () => {
      jest.spyOn(component.instance(), 'plantInPlot').mockImplementation();
      handlers().handlePlotClick(0, 0);

      expect(component.instance().plantInPlot).toHaveBeenCalledWith(
        0,
        0,
        'sample-crop-3'
      );
    });
  });

  describe('fieldMode === fieldMode.HARVEST', () => {
    beforeEach(() => {
      component.setState({
        fieldMode: fieldMode.HARVEST,
      });
    });

    test('calls clearPlot', () => {
      jest.spyOn(component.instance(), 'clearPlot');
      handlers().handlePlotClick(0, 0);

      expect(component.instance().clearPlot).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('fieldMode === fieldMode.CLEANUP', () => {
    beforeEach(() => {
      component.setState({
        fieldMode: fieldMode.CLEANUP,
      });
    });

    test('calls waterPlot', () => {
      jest.spyOn(component.instance(), 'harvestPlot');
      handlers().handlePlotClick(0, 0);

      expect(component.instance().harvestPlot).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('fieldMode === fieldMode.WATER', () => {
    beforeEach(() => {
      component.setState({
        fieldMode: fieldMode.WATER,
      });
    });

    test('calls waterPlot', () => {
      jest.spyOn(component.instance(), 'waterPlot');
      handlers().handlePlotClick(0, 0);

      expect(component.instance().waterPlot).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('fieldMode === fieldMode.FERTILIZE', () => {
    beforeEach(() => {
      component.setState({
        fieldMode: fieldMode.FERTILIZE,
      });
    });

    test('calls fertilizePlot', () => {
      jest.spyOn(component.instance(), 'fertilizePlot');
      handlers().handlePlotClick(0, 0);

      expect(component.instance().fertilizePlot).toHaveBeenCalledWith(0, 0);
    });
  });
});

describe('handleEndDayButtonClick', () => {
  test('increments the day', () => {
    jest.spyOn(component.instance(), 'incrementDay');
    handlers().handleEndDayButtonClick();
    expect(component.instance().incrementDay).toHaveBeenCalled();
  });
});
