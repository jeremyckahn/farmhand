import { screen, waitFor } from '@testing-library/react'

import { saveDataStubFactory } from '../test-utils/stubs/saveDataStubFactory.js'
import { farmhandStub } from '../test-utils/stubs/farmhandStub.js'
import { endDay, waitForBoot } from '../test-utils/ui.js'

describe('bootup', () => {
  test('boots a fresh game when there is no save file', async () => {
    await farmhandStub()
    await waitForBoot()
  })

  test('boots from save file if there is one', async () => {
    const loadedState = saveDataStubFactory({
      dayCount: 10,
    })

    await farmhandStub({
      localforage: {
        getItem: () => Promise.resolve(loadedState),
        setItem: (_key: string, data: unknown) => Promise.resolve(data),
      },
    })

    await waitFor(() => {
      // Both the AppBar's season display ("Day 10 of Spring") and the
      // sidebar's day-and-progress-container ("Day 10, level:") match this
      // substring, so assert on the match set rather than a single element.
      expect(
        screen.getAllByText('Day 10', { exact: false })[0]
      ).toBeInTheDocument()
    })
  })

  test('shows pending notification for loaded day', async () => {
    const loadedState = saveDataStubFactory({
      newDayNotifications: [
        {
          message: 'Pending notification',
          severity: 'info',
        },
      ],
    })

    await farmhandStub({
      localforage: {
        getItem: () => Promise.resolve(loadedState),
        setItem: (_key: string, data: unknown) => Promise.resolve(data),
      },
    })

    await waitFor(() => {
      expect(screen.getByText('Pending notification')).toBeInTheDocument()
    })
  })

  test('pending notifications for the loaded day are not shown again the next day', async () => {
    const loadedState = saveDataStubFactory({
      newDayNotifications: [
        {
          message: 'Pending notification',
          severity: 'info',
        },
      ],
    })

    await farmhandStub({
      localforage: {
        getItem: () => Promise.resolve(loadedState),
        setItem: (_key: string, data: unknown) => Promise.resolve(data),
      },
    })

    await waitFor(() => {
      expect(screen.getByText('Pending notification')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.queryByText('Pending notification')).not.toBeInTheDocument()
    })

    await endDay()

    // The notification was not shown again
    expect(screen.queryByText('Pending notification')).not.toBeInTheDocument()
  })
})
