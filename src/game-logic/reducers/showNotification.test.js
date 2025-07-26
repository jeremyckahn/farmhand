import { testState } from '../../test-utils/index.js'

import { showNotification } from './showNotification.js'

describe('showNotification', () => {
  test('sets notification state', () => {
    const { latestNotification, todaysNotifications } = showNotification(
      testState({ showNotifications: true, todaysNotifications: [] }),
      'foo'
    )
    const notificationObject = { message: 'foo', severity: 'info' }
    expect(latestNotification).toEqual(notificationObject)
    expect(todaysNotifications).toEqual([{ ...notificationObject }])
  })

  test('does not show redundant notifications', () => {
    const state = showNotification(
      testState({ todaysNotifications: [] }),
      'foo'
    )

    const { todaysNotifications } = showNotification(state, 'foo')
    expect(todaysNotifications).toEqual([{ message: 'foo', severity: 'info' }])
  })
})
