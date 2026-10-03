import { notificationSeverity } from '../../enums.js'
// TODO: Change showNotification to accept a configuration object instead of so
// many formal parameters.
/**
 * @param severity Corresponds to the `severity` prop here:
https://material-ui.com/api/alert/
 * @see ://material-ui.com/api/alert/
 */
export const showNotification = (
  state: farmhand.state,
  message: string,
  severity: notificationSeverity = 'info',
  onClick: farmhand.notification['onClick'] = undefined,
  actionLabel: farmhand.notification['actionLabel'] = undefined
): farmhand.state => {
  const { showNotifications, todaysNotifications } = state

  return {
    ...state,
    ...(showNotifications && {
      latestNotification: {
        message,
        onClick,
        actionLabel,
        severity,
      },
    }),
    // Don't show redundant notifications
    todaysNotifications: todaysNotifications.find(
      notification => notification.message === message
    )
      ? todaysNotifications
      : todaysNotifications.concat({ message, onClick, actionLabel, severity }),
  }
}
