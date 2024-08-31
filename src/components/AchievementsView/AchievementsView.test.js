import React from 'react'
import { shallow } from 'enzyme'

import AchievementsView from './AchievementsView.js'

let component

beforeEach(() => {
  component = shallow(<AchievementsView {...{}} />)
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
