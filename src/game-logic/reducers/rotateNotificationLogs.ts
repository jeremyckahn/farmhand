import { NOTIFICATION_LOG_SIZE } from '../../constants.js'

export const rotateNotificationLogs = (
  state: farmhand.state
): farmhand.state => {
  const notificationLog = [...state.notificationLog]

  const { dayCount, newDayNotifications } = state

  const notifications: farmhand.notificationLogEntry['notifications'] = {
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
