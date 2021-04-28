import React from 'react'
import { shallow } from 'enzyme'

import Home from './Home'

let component

beforeEach(() => {
  component = shallow(
    <Home
      {...{
        completedAchievements: {},
        handleViewChangeButtonClick: () => {},
      }}
    />
  )
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
