import { useContext, useEffect, useRef } from 'react'
// eslint-disable-next-line import/extensions
import { useRegisterSW } from 'virtual:pwa-register/react'

import FarmhandContext from '../Farmhand/Farmhand.context.js'

// How long to wait for the new service worker to take over and reload the
// page before reloading it directly.
const RELOAD_FALLBACK_DELAY = 1000

const UpdateNotifier = () => {
  const {
    gameState: { hasBooted },
    handlers: { handleGameUpdateAvailable },
  } = useContext(FarmhandContext)

  const {
    needRefresh: [appNeedsUpdate],
    updateServiceWorker,
  } = useRegisterSW()

  const hasNotifiedRef = useRef(false)

  useEffect(() => {
    // Wait for the saved game to load: restoring it replaces
    // todaysNotifications, which would drop this notification from the
    // Farmer's Log.
    if (!appNeedsUpdate || !hasBooted || hasNotifiedRef.current) {
      return
    }

    // handleGameUpdateAvailable isn't referentially stable, so without this
    // guard every re-render would show the notification again (and the
    // resulting state update would re-render, looping forever).
    hasNotifiedRef.current = true

    handleGameUpdateAvailable(async () => {
      await updateServiceWorker(true)

      // updateServiceWorker only reloads the page once a waiting service
      // worker takes control, which might never happen (e.g. if it was
      // already activated by another tab). Reload anyway so the button
      // always does something.
      setTimeout(() => window.location.reload(), RELOAD_FALLBACK_DELAY)
    })

    // NOTE: This ensures the game is updated when the user next opens it.
    window.addEventListener('beforeunload', () => {
      updateServiceWorker(true)
    })
  }, [
    appNeedsUpdate,
    hasBooted,
    handleGameUpdateAvailable,
    updateServiceWorker,
  ])

  return null
}

export default UpdateNotifier
