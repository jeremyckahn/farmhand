import { screen, waitFor } from '@testing-library/react'

import { NOTIFICATION_DURATION } from '../constants.js'
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
        setItem: (_key: string, data: unknown) => Promise.resolve(data),
      },
    })

    await waitFor(() => {
      expect(screen.getByText('Pending notification')).toBeInTheDocument()
    })
  })

  test(
    'pending notifications for the loaded day are not shown again the next day',
    async () => {
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

      // The notification auto-hides after NOTIFICATION_DURATION; give waitFor
      // a timeout comfortably past that instead of its default 1000ms.
      await waitFor(
        () => {
          expect(
            screen.queryByText('Pending notification')
          ).not.toBeInTheDocument()
        },
        { timeout: NOTIFICATION_DURATION + 2000 }
      )

      await endDay()

      // The notification was not shown again
      expect(screen.queryByText('Pending notification')).not.toBeInTheDocument()
    },
    NOTIFICATION_DURATION + 5000
  )
})
