import React from 'react'
import { shallow } from 'enzyme'

import Achievement from './Achievement'

let component

beforeEach(() => {
  component = shallow(
    <Achievement {...{ achievement: {}, completedAchievements: {} }} />
  )
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
