import React from 'react'
import { shallow } from 'enzyme'

import AccountingView from './AccountingView'

let component

beforeEach(() => {
  component = shallow(<AccountingView {...{}} />)
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
