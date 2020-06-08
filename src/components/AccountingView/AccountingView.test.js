import React from 'react'
import { shallow } from 'enzyme'

import AccountingView from './AccountingView'

let component

beforeEach(() => {
  component = shallow(
    <AccountingView
      {...{
        handleClickLoanPaydownButton: () => {},
        handleClickTakeOutLoanButton: () => {},
        loanBalance: 0,
        money: 0,
      }}
    />
  )
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
