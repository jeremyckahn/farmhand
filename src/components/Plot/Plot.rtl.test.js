import React, { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { testCrop, testShoveledPlot } from '../../test-utils'
import { cropLifeStage } from '../../enums'

import { Plot } from './Plot'

jest.mock('../../data/maps')
jest.mock('../../data/items')
jest.mock('../../img')

describe('class states', () => {
  beforeEach(() => {
    render(
      <Plot
        {...{
          handlePlotClick: () => {},
          isInHoverRange: false,
          selectedItemId: '',
          setHoveredPlot: () => {},
          x: 0,
          y: 0,
        }}
      />
    )
  })

  test('renders standard classes', () => {
      const img = screen.queryByAltText('')
      const { classList } = img.closest('.Plot')

      expect(classList).toContain('is-empty')
      expect(classList).toContain('can-be-mined')
  });
})

describe('background image', () => {
  describe('crops', () => {
    beforeEach(() => {
      render(
        <Plot
          {...{
            handlePlotClick: () => {},
            isInHoverRange: false,
            lifeStage: cropLifeStage.GROWN,
            plotContent: testCrop({
              itemId: 'sample-crop-1',
            }),
            selectedItemId: '',
            setHoveredPlot: () => {},
            x: 0,
            y: 0,
          }}
        />
      )
    })

    test('renders crop classes', () => {
      const img = screen.queryByAltText('Sample Crop Item 1')
      const { classList } = img

      expect(classList).toContain('animated')
      expect(classList).toContain('heartBeat')
    })
  })

  describe('ores', () => {
    beforeEach(() => {
      const PlotTestHarness = ({ children, plotProps }) => {
        const [isShoveled, setIsShoveled] = useState(false)

        return (
          <div>
            <Plot
              {...{
                ...plotProps,
                plotContent: testShoveledPlot({
                  oreId: 'sample-ore-1',
                  isShoveled,
                }),
                handlePlotClick: () => setIsShoveled(true),
              }}
            />
          </div>
        )
      }

      render(
        <PlotTestHarness
          {...{
            plotProps: {
              isInHoverRange: false,
              lifeStage: cropLifeStage.SEED,
              selectedItemId: '',
              setHoveredPlot: () => {},
              x: 0,
              y: 0,
            },
          }}
        />
      )
    })

    test('renders bare plot classes', () => {
      const img = screen.queryByAltText('Sample Ore 1')
      const { classList } = img

      expect(classList).not.toContain('animated')
      expect(classList).not.toContain('was-just-shoveled')
    })

    test('renders newly-mined ore classes', () => {
      const img = screen.queryByAltText('Sample Ore 1')
      const { classList } = img
      userEvent.click(img)

      expect(classList).toContain('animated')
      expect(classList).toContain('was-just-shoveled')
    })
  })
})
