import React from 'react'
import { shallow } from 'enzyme'
import MenuItem from '@mui/material/MenuItem/index.js'

import { dialogView, stageFocusType } from '../../enums.js'
import { INFINITE_STORAGE_LIMIT } from '../../constants.js'
import { noop } from '../../utils/noop.js'

import { Navigation } from './Navigation.js'

let component

beforeEach(() => {
  component = shallow(
    <Navigation
      {...{
        activePlayers: null,
        blockInput: false,
        currentDialogView: dialogView.NONE,
        dayCount: 0,
        farmName: '',
        handleActivePlayerButtonClick: noop,
        handleChatRoomOpenStateChange: noop,
        handleClickDialogViewButton: noop,
        handleCloseDialogView: noop,
        handleDialogViewExited: noop,
        handleFarmNameUpdate: noop,
        handleOnlineToggleChange: noop,
        handleRoomChange: noop,
        handleViewChange: noop,
        inventory: [],
        inventoryLimit: INFINITE_STORAGE_LIMIT,
        itemsSold: {},
        isChatAvailable: false,
        isDialogViewOpen: false,
        isOnline: false,
        room: '',
        stageFocus: stageFocusType.FIELD,
        viewList: ['HOME', 'FIELD', 'SHOP', 'WORKSHOP'],
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
    component.setProps({
      viewList: ['HOME', 'FIELD', 'SHOP', 'COW_PEN', 'WORKSHOP'],
    })
    expect(
      component
        .find(MenuItem)
        .filterWhere(
          menuItem => menuItem.props().value === stageFocusType.COW_PEN
        )
    ).toHaveLength(1)
  })
})
