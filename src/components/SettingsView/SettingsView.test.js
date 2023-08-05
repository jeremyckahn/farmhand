import React from 'react'
import { shallow } from 'enzyme'

import { noop } from '../../utils/noop'

import SettingsView from './SettingsView'

let component

beforeEach(() => {
  component = shallow(
    <SettingsView
      {...{
        allowCustomPeerCowNames: false,
        handleClearPersistedDataClick: noop,
        handleExportDataClick: noop,
        handleImportDataClick: noop,
        handleSaveButtonClick: noop,
        handleShowNotificationsChange: noop,
        handleUseAlternateEndDayButtonPositionChange: noop,
        handleShowHomeScreenChange: noop,
        showNotifications: true,
        useAlternateEndDayButtonPosition: false,
        showHomeScreen: false,
      }}
    />
  )
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
