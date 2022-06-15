import { waitFor, screen } from '@testing-library/react'

import { farmhandStub } from '../../test-utils/stubs/farmhandStub'

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
})
