import React from 'react'
import { shallow } from 'enzyme'
import MenuItem from '@material-ui/core/MenuItem'

import { dialogView, stageFocusType } from '../../enums'

import { Navigation } from './Navigation'

let component

beforeEach(() => {
  component = shallow(
    <Navigation
      {...{
        currentDialogView: dialogView.NONE,
        dayCount: 0,
        handleClickDialogViewButton: () => {},
        handleCloseDialogView: () => {},
        handleViewChange: () => {},
        purchasedCowPen: 0,
        stageFocus: stageFocusType.FIELD,
      }}
    />
  )
})

test('renders', () => {
  expect(component.hasClass('Navigation')).toBeTruthy()
})

describe('cow pen option', () => {
  test('does not show if player has not bought a cow pen', () => {
    expect(
      component
        .find(MenuItem)
        .filterWhere(
          menuItem => menuItem.props().value === stageFocusType.COW_PEN
        )
    ).toHaveLength(0)
  })

  test('does show if player has bought a cow pen', () => {
    component.setProps({ purchasedCowPen: 1 })
    expect(
      component
        .find(MenuItem)
        .filterWhere(
          menuItem => menuItem.props().value === stageFocusType.COW_PEN
        )
    ).toHaveLength(1)
  })
})
