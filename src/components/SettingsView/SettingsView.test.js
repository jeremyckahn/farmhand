import React from 'react'
import { shallow } from 'enzyme'

import SettingsView from './SettingsView'

let component

beforeEach(() => {
  component = shallow(
    <SettingsView
      {...{
        allowCustomPeerCowNames: false,
        handleClearPersistedDataClick: () => {},
        handleExportDataClick: () => {},
        handleImportDataClick: () => {},
        handleSaveButtonClick: () => {},
        handleShowNotificationsChange: () => {},
        handleUseAlternateEndDayButtonPositionChange: () => {},
        handleShowHomeScreenChange: () => {},
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
