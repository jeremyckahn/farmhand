/**
 * @typedef {import("../../components/Farmhand/Farmhand").farmhand.state} state
 * @typedef {import('@material-ui/lab/Alert').Color} alertSeverity
 * @typedef {import('@material-ui/lab/Alert').AlertProps} AlertProps
 */

// TODO: Change showNotification to accept a configuration object instead of so
// many formal parameters.
/**
 * @param {state} state
 * @param {string} message
 * @param {alertSeverity} [severity] Corresponds to the `severity` prop here:
 * https://material-ui.com/api/alert/
 * @param {AlertProps['onClick']} onClick
 * @returns {state}
 * @see https://material-ui.com/api/alert/
 */
export const showNotification = (
  state,
  message,
  severity = 'info',
  onClick = undefined
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
