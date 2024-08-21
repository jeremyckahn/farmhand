import { act, screen, waitFor } from '@testing-library/react'

import { saveDataStubFactory } from '../test-utils/stubs/saveDataStubFactory'
import { farmhandStub } from '../test-utils/stubs/farmhandStub'
import { endDay } from '../test-utils/ui'

beforeEach(() => {
  vitest.useFakeTimers()
})

describe('bootup', () => {
  test('boots a fresh game when there is no save file', async () => {
    await farmhandStub()

    await waitFor(() => {
      expect(screen.getByText('Day 1', { exact: false })).toBeInTheDocument()
    })
  })

  test('boots from save file if there is one', async () => {
    const loadedState = saveDataStubFactory({
      dayCount: 10,
    })

    await farmhandStub({
      localforage: {
        getItem: () => Promise.resolve(loadedState),
        setItem: (_key, data) => Promise.resolve(data),
      },
    })

    await waitFor(() => {
      expect(screen.getByText('Day 10', { exact: false })).toBeInTheDocument()
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
        setItem: (_key, data) => Promise.resolve(data),
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
        setItem: (_key, data) => Promise.resolve(data),
      },
    })

    await waitFor(() => {
      expect(screen.getByText('Pending notification')).toBeInTheDocument()
    })

    act(() => {
      vitest.runAllTimers()
    })

    await waitFor(() => {
      expect(screen.queryByText('Pending notification')).not.toBeInTheDocument()
    })

    await endDay()

    // The notification was not shown again
    expect(screen.queryByText('Pending notification')).not.toBeInTheDocument()
  })
})
