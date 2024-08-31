import { NOTIFICATION_LOG_SIZE } from '../../constants.js'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const rotateNotificationLogs = state => {
  const notificationLog = [...state.notificationLog]

  const { dayCount, newDayNotifications } = state

  const notifications = {
    error: [],
    info: [],
    success: [],
    warning: [],
  }

  newDayNotifications.forEach(({ message, severity }) =>
    notifications[severity].push(message)
  )

  if (newDayNotifications.length) {
    notificationLog.unshift({
      day: dayCount,
      notifications,
    })
  }

  notificationLog.length = Math.min(
    notificationLog.length,
    NOTIFICATION_LOG_SIZE
  )

  return { ...state, notificationLog }
}
