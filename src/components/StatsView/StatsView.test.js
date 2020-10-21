import React from 'react'
import { shallow } from 'enzyme'

import StatsView from './StatsView'

let component

beforeEach(() => {
  component = shallow(
    <StatsView
      {...{
        historicalDailyLosses: [],
        historicalDailyRevenue: [],
        itemsSold: {},
        record7dayProfitAverage: 0,
        revenue: 0,
        todaysLosses: 0,
        todaysRevenue: 0,
      }}
    />
  )
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
