import React, { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { testShoveledPlot } from '../../test-utils'
import { cropLifeStage } from '../../enums'

import { Plot } from './Plot'

jest.mock('../../data/maps')
jest.mock('../../data/items')
jest.mock('../../img')

describe('background image', () => {
  describe('class states', () => {
    describe('ores', () => {
      test('renders newly-mined ore classes', () => {
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

        const img = screen.queryByAltText('Sample Ore 1')
        const { classList } = img

        expect(classList).not.toContain('animated')
        expect(classList).not.toContain('was-just-shoveled')

        userEvent.click(img)

        expect(classList).toContain('animated')
        expect(classList).toContain('was-just-shoveled')
      })
    })
  })
})
