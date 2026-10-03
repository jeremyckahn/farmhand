import { useContext, useEffect } from 'react'
// eslint-disable-next-line import/extensions
import { useRegisterSW } from 'virtual:pwa-register/react'

import FarmhandContext from '../Farmhand/Farmhand.context.js'

// TEMPORARY DEBUG: Always show the "update available" notification so its
// rendering can be checked on real devices. Revert this before merging.
const FORCE_UPDATE_NOTIFICATION = true

const UpdateNotifier = () => {
  const {
    gameState: { hasBooted },
    handlers: { handleGameUpdateAvailable },
  } = useContext(FarmhandContext)

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW()
  const appNeedsUpdate = needRefresh || FORCE_UPDATE_NOTIFICATION

  useEffect(() => {
    // Wait for the saved game to load: restoring it replaces
    // todaysNotifications, which would drop this notification from the
    // Farmer's Log.
    if (!appNeedsUpdate || !hasBooted) {
      return
    }

    handleGameUpdateAvailable(updateServiceWorker)

    // NOTE: This ensures the game is updated when the user next opensit.
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
