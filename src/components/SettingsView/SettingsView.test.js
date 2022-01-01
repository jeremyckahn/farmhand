import React from 'react'
import { shallow } from 'enzyme'

import SettingsView from './SettingsView'

let component

beforeEach(() => {
  component = shallow(
    <SettingsView
      {...{
        handleClearPersistedDataClick: () => {},
        handleExportDataClick: () => {},
        handleImportDataClick: () => {},
        handleSaveButtonClick: () => {},
        handleShowNotificationsChange: () => {},
        handleUseAlternateEndDayButtonPositionChange: () => {},
        handleHideHomeScreenChange: () => {},
        showNotifications: true,
        useAlternateEndDayButtonPosition: false,
        hideHomeScreen: false
      }}
    />
  )
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
