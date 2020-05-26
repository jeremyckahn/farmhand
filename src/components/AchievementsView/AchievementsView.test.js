import React from 'react'
import { shallow } from 'enzyme'

import AchievementsView from './AchievementsView'

let component

beforeEach(() => {
  component = shallow(<AchievementsView {...{}} />)
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
