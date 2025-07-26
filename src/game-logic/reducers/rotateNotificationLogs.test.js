import { NOTIFICATION_LOG_SIZE } from '../../constants.js'
import { testState } from '../../test-utils/index.js'

import { rotateNotificationLogs } from './rotateNotificationLogs.js'

describe('rotateNotificationLogs', () => {
  test('rotates logs', () => {
    const { notificationLog } = rotateNotificationLogs(
      testState({
        dayCount: 1,
        newDayNotifications: [{ message: 'b', severity: 'info' }],
        notificationLog: [
          {
            day: 0,
            notifications: {
              error: [],
              info: ['a'],
              success: [],
              warning: [],
            },
          },
        ],
      })
    )

    expect(notificationLog).toEqual([
      {
        day: 1,
        notifications: {
          error: [],
          info: ['b'],
          success: [],
          warning: [],
        },
      },
      {
        day: 0,
        notifications: {
          error: [],
          info: ['a'],
          success: [],
          warning: [],
        },
      },
    ])
  })

  test('limits log size', () => {
    const { notificationLog } = rotateNotificationLogs(
      testState({
        dayCount: 50,
        newDayNotifications: [{ message: 'new log', severity: 'info' }],
        notificationLog: new Array(NOTIFICATION_LOG_SIZE).fill({
          day: 1,
          notifications: {
            error: [],
            info: ['a'],
            success: [],
            warning: [],
          },
        }),
      })
    )

    expect(notificationLog).toHaveLength(NOTIFICATION_LOG_SIZE)
    expect(notificationLog[0]).toEqual({
      day: 50,
      notifications: {
        error: [],
        info: ['new log'],
        success: [],
        warning: [],
      },
    })
  })

  test('ignores empty logs', () => {
    const { notificationLog } = rotateNotificationLogs(
      testState({
        newDayNotifications: [],
        notificationLog: [
          {
            day: 0,
            notifications: {
              error: [],
              info: ['a'],
              success: [],
              warning: [],
            },
          },
        ],
      })
    )

    expect(notificationLog).toEqual([
      {
        day: 0,
        notifications: {
          error: [],
          info: ['a'],
          success: [],
          warning: [],
        },
      },
    ])
  })
})
