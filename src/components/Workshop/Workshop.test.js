import React from 'react'
import { shallow } from 'enzyme'

import Workshop from './Workshop'

let component

beforeEach(() => {
  component = shallow(
    <Workshop
      {...{
        learnedRecipes: {},
      }}
    />
  )
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
