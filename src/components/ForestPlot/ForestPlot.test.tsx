import React from 'react'
import { render } from '@testing-library/react'

import { fieldMode, toolLevel, toolType } from '../../enums.js'

import { ForestPlot } from './ForestPlot.js'

const toolLevels = {
  AXE: toolLevel.DEFAULT,
  HOE: toolLevel.DEFAULT,
  PICKER_POLE: toolLevel.DEFAULT,
  SCYTHE: toolLevel.DEFAULT,
  SHOVEL: toolLevel.DEFAULT,
  WATERING_CAN: toolLevel.DEFAULT,
} as Record<toolType, toolLevel>

describe('<ForestPlot />', () => {
  test('clicking the tree sprite calls handleForestPlotClick exactly once', () => {
    const handleForestPlotClick = vitest.fn()

    const { container } = render(
      <ForestPlot
        {...{
          fieldMode: fieldMode.OBSERVE,
          plotContent: { itemId: 'apple', daysOld: 0, daysSinceLastHarvest: 0 },
          handleForestPlotClick,
          toolLevels,
          x: 2,
          y: 3,
        }}
      />
    )

    const treeSprite = container.querySelector('.ForestTreeSprite')

    expect(treeSprite).not.toBeNull()

    treeSprite?.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true })
    )

    expect(handleForestPlotClick).toHaveBeenCalledTimes(1)
    expect(handleForestPlotClick).toHaveBeenCalledWith(2, 3)
  })

  test('clicking the plot background calls handleForestPlotClick exactly once', () => {
    const handleForestPlotClick = vitest.fn()

    const { container } = render(
      <ForestPlot
        {...{
          fieldMode: fieldMode.OBSERVE,
          plotContent: { itemId: 'apple', daysOld: 0, daysSinceLastHarvest: 0 },
          handleForestPlotClick,
          toolLevels,
          x: 1,
          y: 0,
        }}
      />
    )

    const plot = container.querySelector('.ForestPlot')

    expect(plot).not.toBeNull()

    plot?.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true })
    )

    expect(handleForestPlotClick).toHaveBeenCalledTimes(1)
    expect(handleForestPlotClick).toHaveBeenCalledWith(1, 0)
  })
})
