import React from 'react'
import { render, screen } from '@testing-library/react'

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
        render(
          <Plot
            {...{
              handlePlotClick: () => {},
              isInHoverRange: false,
              plotContent: testShoveledPlot({
                oreId: 'sample-ore-1',
                isShoveled: false,
              }),
              lifeStage: cropLifeStage.SEED,
              selectedItemId: '',
              setHoveredPlot: () => {},
              x: 0,
              y: 0,
            }}
          />
        )

        let classList = screen.queryByAltText('Sample Ore 1').classList

        expect(classList).not.toContain('animated')
        expect(classList).not.toContain('was-just-shoveled')

        // FIXME: Simulate shoveling the plot and assert that the above classes are present
      })
    })
  })
})
