import React from 'react'
import { shallow } from 'enzyme'

import StatsView from './StatsView'

let component

beforeEach(() => {
  component = shallow(
    <StatsView
      {...{
        cowsTraded: 0,
        farmName: '',
        historicalDailyLosses: [],
        historicalDailyRevenue: [],
        itemsSold: {},
        profitabilityStreak: 0,
        record7dayProfitAverage: 0,
        recordProfitabilityStreak: 0,
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
