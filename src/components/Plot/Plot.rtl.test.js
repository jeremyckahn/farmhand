import React, { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { cropLifeStage } from '../../enums.js'
import { testCrop, testShoveledPlot } from '../../test-utils/index.js'
import {
  getCropFromItemId,
  getPlotContentFromItemId,
} from '../../utils/index.js'
import { noop } from '../../utils/noop.js'
import { items } from '../../img/index.js'

import { Plot } from './Plot.js'

vitest.mock('../../img/index.js')

describe('class states', () => {
  beforeEach(() => {
    render(
      <Plot
        {...{
          handlePlotClick: noop,
          isInHoverRange: false,
          selectedItemId: '',
          setHoveredPlot: noop,
          x: 0,
          y: 0,
        }}
      />
    )
  })

  test('renders standard classes', () => {
    const img = screen.queryByAltText('Empty plot')
    const plotElement = img?.closest('.Plot')
    const { classList } = plotElement || { classList: new DOMTokenList() }

    expect(classList).toContain('is-empty')
  })
})

describe('plot label', () => {
  test('renders label for seed', () => {
    render(
      <Plot
        {...{
          handlePlotClick: noop,
          isInHoverRange: false,
          selectedItemId: '',
          setHoveredPlot: noop,
          plotContent: getCropFromItemId('carrot'),
          x: 0,
          y: 0,
        }}
      />
    )

    const plantedCrop = screen.getByAltText('Carrot Seed')
    expect(plantedCrop).toBeInTheDocument()
  })

  test('renders label for seed of crop with varieties', () => {
    render(
      <Plot
        {...{
          handlePlotClick: noop,
          isInHoverRange: false,
          selectedItemId: '',
          setHoveredPlot: noop,
          plotContent: getCropFromItemId('grape-chardonnay'),
          x: 0,
          y: 0,
        }}
      />
    )

    const plantedCrop = screen.getByAltText('Grape Seed')
    expect(plantedCrop).toBeInTheDocument()
  })

  test('renders label for crop', () => {
    render(
      <Plot
        {...{
          handlePlotClick: noop,
          isInHoverRange: false,
          selectedItemId: '',
          setHoveredPlot: noop,
          plotContent: {
            ...getCropFromItemId('carrot'),
            daysOld: 9,
            daysWatered: 9,
          },
          x: 0,
          y: 0,
        }}
      />
    )

    const plantedCrop = screen.getByAltText('Carrot')
    expect(plantedCrop).toBeInTheDocument()
  })
})

describe('background image', () => {
  describe('crops', () => {
    beforeEach(() => {
      render(
        <Plot
          {...{
            handlePlotClick: noop,
            isInHoverRange: false,
            lifeStage: cropLifeStage.GROWN,
            plotContent: testCrop({
              itemId: 'carrot',
            }),
            selectedItemId: '',
            setHoveredPlot: noop,
            x: 0,
            y: 0,
          }}
        />
      )
    })

    test('renders crop classes', () => {
      const img = screen.getByAltText('Carrot Seed')
      const { classList } = img

      expect(classList).toContain('animated')
      expect(classList).toContain('heartBeat')
    })
  })

  describe('ores', () => {
    beforeEach(() => {
      const PlotTestHarness = ({ plotProps }) => {
        const [isShoveled, setIsShoveled] = useState(false)

        return (
          <div>
            <Plot
              {...{
                ...plotProps,
                plotContent: testShoveledPlot({
                  oreId: 'stone',
                  isShoveled,
                  daysUntilClear: 5,
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
              selectedItemId: '',
              setHoveredPlot: noop,
              x: 0,
              y: 0,
            },
          }}
        />
      )
    })

    test('renders bare plot classes', () => {
      const img = screen.getByAltText('Empty plot')
      const { classList } = img

      expect(classList).not.toContain('animated')
      expect(classList).not.toContain('was-just-shoveled')
    })

    test('renders newly-mined ore classes', () => {
      const img = screen.getByAltText('Empty plot')
      const { classList } = img
      userEvent.click(img)

      expect(classList).toContain('animated')
      expect(classList).toContain('was-just-shoveled')

      const updatedImg = screen.getByAltText('Shoveled plot of Stone')
      expect(updatedImg).toBeInTheDocument()
    })
  })

  describe('scarecrows', () => {
    beforeEach(() => {
      render(
        <Plot
          {...{
            handlePlotClick: noop,
            isInHoverRange: false,
            plotContent: {
              ...getPlotContentFromItemId('scarecrow'),
            },
            selectedItemId: '',
            setHoveredPlot: noop,
            x: 0,
            y: 0,
          }}
        />
      )
    })

    test('renders scarecrow image', async () => {
      const img = await screen.findByAltText('Scarecrow')
      expect(img.style.backgroundImage).toMatch(items.scarecrow)
    })
  })

  describe('sprinklers', () => {
    beforeEach(() => {
      render(
        <Plot
          {...{
            handlePlotClick: noop,
            isInHoverRange: false,
            plotContent: {
              ...getPlotContentFromItemId('sprinkler'),
            },
            selectedItemId: '',
            setHoveredPlot: noop,
            x: 0,
            y: 0,
          }}
        />
      )
    })

    test('renders sprinkler image', async () => {
      const img = await screen.findByAltText('Sprinkler')
      expect(img.style.backgroundImage).toMatch(items.sprinkler)
    })
  })
})
