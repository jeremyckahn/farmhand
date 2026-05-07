
// TODO: Change showNotification to accept a configuration object instead of so
// many formal parameters.
/**
 * @param state
 * @param message
 * @param [severity] Corresponds to the `severity` prop here:
 * https://material-ui.com/api/alert/
 * @param onClick
 * @returns {state}
 * @see https://material-ui.com/api/alert/
 */
export const showNotification = (
  state,
  message,
  severity = 'info',
  onClick: import('@mui/material/Alert').AlertProps['onClick'] = undefined
) => {
  const { showNotifications, todaysNotifications } = state

  return {
    ...state,
    ...(showNotifications && {
      latestNotification: {
        message,
        onClick,
        severity,
      },
    }),
    // Don't show redundant notifications
    todaysNotifications: todaysNotifications.find(
      notification => notification.message === message
    )
      ? todaysNotifications
      : todaysNotifications.concat({ message, onClick, severity }),
  }
}
