import { NOTIFICATION_LOG_SIZE } from '../../constants.js'


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
    notifications[/** @type {string} */ severity].push(message)
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
