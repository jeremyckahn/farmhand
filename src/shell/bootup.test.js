import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { farmhandStub } from '../test-utils/stubs/farmhandStub'

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
    await farmhandStub({
      localforage: {
        getItem: () => Promise.resolve({ dayCount: 10 }),
        setItem: (_key, data) => Promise.resolve(data),
      },
    })

    await waitFor(() => {
      expect(screen.getByText('Day 10', { exact: false })).toBeInTheDocument()
    })
  })

  test('shows pending notification for loaded day', async () => {
    await farmhandStub({
      localforage: {
        getItem: () =>
          Promise.resolve({
            newDayNotifications: [
              {
                message: 'Pending notification',
                severity: 'info',
              },
            ],
          }),
        setItem: (_key, data) => Promise.resolve(data),
      },
    })

    await waitFor(() => {
      expect(screen.getByText('Pending notification')).toBeInTheDocument()
    })
  })

  test('pending notifications for the loaded day are not shown again the next day', async () => {
    await farmhandStub({
      localforage: {
        getItem: () =>
          Promise.resolve({
            newDayNotifications: [
              {
                message: 'Pending notification',
                severity: 'info',
              },
            ],
          }),
        setItem: (_key, data) => Promise.resolve(data),
      },
    })

    const endDayButton = await screen.findByLabelText(
      'End the day to save your progress and advance the game.'
    )

    userEvent.click(endDayButton)

    await waitFor(() => {
      expect(screen.queryByText('Pending notification')).not.toBeInTheDocument()
    })
  })
})
