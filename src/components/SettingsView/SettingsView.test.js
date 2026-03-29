import React from 'react'
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { noop } from '../../utils/noop.js'

import { SettingsView } from './SettingsView.js'

const defaultProps = {
  allowCustomPeerCowNames: false,
  handleAllowCustomPeerCowNamesChange: noop,
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
}

test('renders', () => {
  render(<SettingsView {...defaultProps} />)
  expect(screen.getByText('Save Game')).toBeInTheDocument()
})

test('displays all main buttons', () => {
  render(<SettingsView {...defaultProps} />)

  expect(screen.getByText('Save Game')).toBeInTheDocument()
  expect(screen.getByText('Export Game Data')).toBeInTheDocument()
  expect(screen.getByText('Import Game Data')).toBeInTheDocument()
  expect(screen.getByText('Delete Game Data')).toBeInTheDocument()
})

test('displays options form with all switches', () => {
  render(<SettingsView {...defaultProps} />)

  expect(screen.getByText('Options')).toBeInTheDocument()
  expect(
    screen.getByText('Use alternate position for Bed button')
  ).toBeInTheDocument()
  expect(screen.getByText('Show new notifications')).toBeInTheDocument()
  expect(screen.getByText('Show the Home Screen')).toBeInTheDocument()
  expect(
    screen.getByText(
      'Display custom names for cows received from other players'
    )
  ).toBeInTheDocument()
})

test('handles save button click', async () => {
  const user = userEvent.setup()
  const handleSaveButtonClick = vitest.fn()

  render(
    <SettingsView
      {...defaultProps}
      handleSaveButtonClick={handleSaveButtonClick}
    />
  )

  const saveButton = screen.getByText('Save Game')
  await user.click(saveButton)

  expect(handleSaveButtonClick).toHaveBeenCalledTimes(1)
})

test('handles export button click', async () => {
  const user = userEvent.setup()
  const handleExportDataClick = vitest.fn()

  render(
    <SettingsView
      {...defaultProps}
      handleExportDataClick={handleExportDataClick}
    />
  )

  const exportButton = screen.getByText('Export Game Data')
  await user.click(exportButton)

  expect(handleExportDataClick).toHaveBeenCalledTimes(1)
})

test('shows correct switch states based on props', () => {
  render(
    <SettingsView
      {...defaultProps}
      showNotifications={false}
      useAlternateEndDayButtonPosition={true}
      showHomeScreen={true}
      allowCustomPeerCowNames={true}
    />
  )

  const switches = screen.getAllByRole('checkbox')
  expect(switches[0]).toBeChecked() // useAlternateEndDayButtonPosition
  expect(switches[1]).not.toBeChecked() // showNotifications
  expect(switches[2]).toBeChecked() // showHomeScreen
  expect(switches[3]).toBeChecked() // allowCustomPeerCowNames
})

test('handles switch toggling', async () => {
  const user = userEvent.setup()
  const handleShowNotificationsChange = vitest.fn()
  const handleUseAlternateEndDayButtonPositionChange = vitest.fn()
  const handleShowHomeScreenChange = vitest.fn()
  const handleAllowCustomPeerCowNamesChange = vitest.fn()

  render(
    <SettingsView
      {...defaultProps}
      handleShowNotificationsChange={handleShowNotificationsChange}
      handleUseAlternateEndDayButtonPositionChange={
        handleUseAlternateEndDayButtonPositionChange
      }
      handleShowHomeScreenChange={handleShowHomeScreenChange}
      handleAllowCustomPeerCowNamesChange={handleAllowCustomPeerCowNamesChange}
    />
  )

  const switches = screen.getAllByRole('checkbox')

  await user.click(switches[0])
  expect(handleUseAlternateEndDayButtonPositionChange).toHaveBeenCalledTimes(1)

  await user.click(switches[1])
  expect(handleShowNotificationsChange).toHaveBeenCalledTimes(1)

  await user.click(switches[2])
  expect(handleShowHomeScreenChange).toHaveBeenCalledTimes(1)

  await user.click(switches[3])
  expect(handleAllowCustomPeerCowNamesChange).toHaveBeenCalledTimes(1)
})

test('opens delete confirmation dialog when delete button is clicked', async () => {
  const user = userEvent.setup()

  render(<SettingsView {...defaultProps} />)

  const deleteButton = screen.getByText('Delete Game Data')
  await user.click(deleteButton)

  expect(await screen.findByText('Delete game data?')).toBeInTheDocument()
  expect(
    await screen.findByText(
      "Are you sure that you want to delete your game data? This can't be undone. You may want to export your game data first."
    )
  ).toBeInTheDocument()
})

test('closes delete confirmation dialog when cancel is clicked', async () => {
  const user = userEvent.setup()

  render(<SettingsView {...defaultProps} />)

  const deleteButton = screen.getByText('Delete Game Data')
  await user.click(deleteButton)

  // Wait for dialog to open
  await screen.findByText('Delete game data?')

  const cancelButton = screen.getByText('Cancel')
  await user.click(cancelButton)

  // Wait for dialog to close
  await waitForElementToBeRemoved(() => screen.queryByText('Delete game data?'))
  expect(screen.queryByText('Delete game data?')).not.toBeInTheDocument()
})

test('handles game data deletion confirmation from user', async () => {
  const user = userEvent.setup()
  const handleClearPersistedDataClick = vitest.fn()

  render(
    <SettingsView
      {...defaultProps}
      handleClearPersistedDataClick={handleClearPersistedDataClick}
    />
  )

  const deleteButton = screen.getByText('Delete Game Data')
  await user.click(deleteButton)

  // Wait for dialog to open
  await screen.findByText('Delete game data?')

  const doItButton = screen.getByText('Do it')
  await user.click(doItButton)

  expect(handleClearPersistedDataClick).toHaveBeenCalledTimes(1)
  // Wait for dialog to close
  await waitForElementToBeRemoved(() => screen.queryByText('Delete game data?'))
  expect(screen.queryByText('Delete game data?')).not.toBeInTheDocument()
})

test('displays tooltips for export and import buttons', async () => {
  const user = userEvent.setup()

  render(<SettingsView {...defaultProps} />)

  const exportButton = screen.getByText('Export Game Data')
  await user.hover(exportButton)

  expect(
    await screen.findByText('Save your game data as a file on your device')
  ).toBeInTheDocument()

  const importButton = screen.getByText('Import Game Data')
  await user.hover(importButton)

  expect(
    await screen.findByText('Load game data that was previously saved')
  ).toBeInTheDocument()
})
