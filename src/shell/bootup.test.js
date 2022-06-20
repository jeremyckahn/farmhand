import { screen, waitFor } from '@testing-library/react'

import { saveFileStubFactory } from '../test-utils/stubs/saveFileStubFactory'
import { farmhandStub } from '../test-utils/stubs/farmhandStub'
import { endDay } from '../test-utils/ui'

beforeEach(() => {
  jest.useFakeTimers()
})

describe('bootup', () => {
  test('boots a fresh game when there is no save file', async () => {
    await farmhandStub()

    await waitFor(() => {
      expect(screen.getByText('Day 1', { exact: false })).toBeInTheDocument()
    })
  })

  test('boots from save file if there is one', async () => {
    const loadedState = saveFileStubFactory({
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
    const loadedState = saveFileStubFactory({
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
    const loadedState = saveFileStubFactory({
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

    await endDay()

    await waitFor(() => {
      expect(screen.queryByText('Pending notification')).not.toBeInTheDocument()
    })
  })
})
