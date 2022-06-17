import { screen, waitFor } from '@testing-library/react'

import { endDay } from '../test-utils/ui'
import { STORM_MESSAGE } from '../strings'
import { farmhandStub } from '../test-utils/stubs/farmhandStub'

describe('notifications', () => {
  test('pending notifications are shown when a day starts', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0)

    await farmhandStub()
    await endDay()

    await waitFor(() => {
      // STORM_MESSAGE message is a sample pending day notification that is
      // known to show upon starting a new day when Math.random() is locked to
      // 0.
      expect(screen.queryByText(STORM_MESSAGE)).toBeInTheDocument()
    })
  })
})
