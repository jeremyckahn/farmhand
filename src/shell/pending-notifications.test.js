import { screen } from '@testing-library/react'

import { endDay } from '../test-utils/ui.js'
import { STORM_MESSAGE } from '../strings.js'
import { farmhandStub } from '../test-utils/stubs/farmhandStub.js'

// This test is in its own file as a workaround for the fact that the utils
// module mocking does not seem to work correctly when mixed with other tests.
// This seems to be due to: https://github.com/facebook/jest/issues/8987

vitest.mock('../utils/index.js', async () => ({
  ...(await vitest.importActual('../utils/index.js')),
  shouldStormToday: () => true,
  shouldPrecipitateToday: () => true,
}))

describe('pending notifications', () => {
  test('are shown when a day starts', async () => {
    await farmhandStub()
    await endDay()

    const stormNotification = await screen.findByText(STORM_MESSAGE)
    expect(stormNotification).toBeInTheDocument()
  })
})
