import { showNotification } from './showNotification.js'

describe('showNotification', () => {
  test('sets notification state', () => {
    const { latestNotification, todaysNotifications } = showNotification(
      { showNotifications: true, todaysNotifications: [] },
      'foo'
    )
    const notificationObject = { message: 'foo', severity: 'info' }
    expect(latestNotification).toEqual(notificationObject)
    expect(todaysNotifications).toEqual([{ ...notificationObject }])
  })

  test('does not show redundant notifications', () => {
    const state = showNotification({ todaysNotifications: [] }, 'foo')

    const { todaysNotifications } = showNotification(state, 'foo')
    expect(todaysNotifications).toEqual([{ message: 'foo', severity: 'info' }])
  })
})
