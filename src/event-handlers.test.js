import React from 'react';
import Farmhand from './Farmhand';
import { stageFocusType, toolType } from './enums';
import { shallow } from 'enzyme';
import { testItem } from './test-utils';

jest.mock('./data/items');

let component;

const handlers = () => component.instance().handlers;

beforeEach(() => {
  component = shallow(<Farmhand />);
});

describe('handleItemPurchase', () => {
  it('calls purchaseItem', () => {
    jest.spyOn(component.instance(), 'purchaseItem');
    handlers().handleItemPurchase(testItem({ id: 'sample-item-1' }));

    expect(component.instance().purchaseItem).toHaveBeenCalledWith(
      testItem({ id: 'sample-item-1' })
    );
  });
});

describe('handleItemSell', () => {
  describe('single instance of item in inventory', () => {
    beforeEach(() => {
      component.setState({
        inventory: [testItem({ id: 'sample-item-1', quantity: 1 })],
        money: 100,
      });

      handlers().handleItemSell(testItem({ id: 'sample-item-1', value: 20 }));
    });

    it('removes item from inventory', () => {
      expect(component.state().inventory).toEqual([]);
    });

    it('adds value of item to player money', () => {
      expect(component.state().money).toEqual(120);
    });
  });

  describe('multiple instances of item in inventory', () => {
    beforeEach(() => {
      component.setState({
        inventory: [testItem({ id: 'sample-item-1', quantity: 2 })],
      });

      handlers().handleItemSell(testItem({ id: 'sample-item-1', value: 20 }));
    });

    it('decrements item', () => {
      expect(component.state().inventory).toEqual([
        testItem({
          id: 'sample-item-1',
          quantity: 1,
        }),
      ]);
    });
  });
});

describe('handleViewChange', () => {
  beforeEach(() => {
    handlers().handleViewChange({ target: { value: stageFocusType.SHOP } });
  });

  it('changes the view type', () => {
    expect(component.state('stageFocus')).toEqual(stageFocusType.SHOP);
  });
});

describe('handlePlantableItemSelect', () => {
  beforeEach(() => {
    component.setState({
      selectedTool: toolType.WATERING_CAN,
    });

    handlers().handlePlantableItemSelect(testItem({ id: 'sample-crop-3' }));
  });

  it('updates selectedPlantableItemId state', () => {
    expect(component.state().selectedPlantableItemId).toEqual('sample-crop-3');
  });

  it('resets state.selectedTool', () => {
    expect(component.state().selectedTool).toEqual(toolType.NONE);
  });
});

describe('handleToolSelect', () => {
  beforeEach(() => {
    component.setState({
      selectedPlantableItemId: 'sample-crop-3',
    });

    handlers().handleToolSelect(toolType.WATERING_CAN);
  });

  it('updates selectedTool state', () => {
    expect(component.state().selectedTool).toEqual(toolType.WATERING_CAN);
  });

  it('resets state.selectedPlantableItemId', () => {
    expect(component.state().selectedPlantableItemId).toEqual('');
  });
});

describe('handlePlotClick', () => {
  beforeEach(() => {
    component.setState({
      selectedPlantableItemId: 'sample-crop-3',
    });
  });

  describe('selectedTool === toolType.NONE', () => {
    beforeEach(() => {
      component.setState({
        selectedTool: toolType.NONE,
        selectedPlantableItemId: 'sample-crop-3',
      });
    });

    it('calls plantInPlot', () => {
      jest.spyOn(component.instance(), 'plantInPlot').mockImplementation();
      handlers().handlePlotClick(0, 0);

      expect(component.instance().plantInPlot).toHaveBeenCalledWith(
        0,
        0,
        'sample-crop-3'
      );
    });
  });

  describe('selectedTool === toolType.HOE', () => {
    beforeEach(() => {
      component.setState({
        selectedTool: toolType.HOE,
      });
    });

    it('calls clearPlot', () => {
      jest.spyOn(component.instance(), 'clearPlot');
      handlers().handlePlotClick(0, 0);

      expect(component.instance().clearPlot).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('selectedTool === toolType.SCYTHE', () => {
    beforeEach(() => {
      component.setState({
        selectedTool: toolType.SCYTHE,
      });
    });

    it('calls waterPlot', () => {
      jest.spyOn(component.instance(), 'harvestPlot');
      handlers().handlePlotClick(0, 0);

      expect(component.instance().harvestPlot).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('selectedTool === toolType.WATERING_CAN', () => {
    beforeEach(() => {
      component.setState({
        selectedTool: toolType.WATERING_CAN,
      });
    });

    it('calls waterPlot', () => {
      jest.spyOn(component.instance(), 'waterPlot');
      handlers().handlePlotClick(0, 0);

      expect(component.instance().waterPlot).toHaveBeenCalledWith(0, 0);
    });
  });
});

describe('handleEndDayButtonClick', () => {
  it('increments the day', () => {
    jest.spyOn(component.instance(), 'incrementDay');
    handlers().handleEndDayButtonClick();
    expect(component.instance().incrementDay).toHaveBeenCalled();
  });
});
